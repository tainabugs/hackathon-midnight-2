import { type DeployedBBoardAPI, type BBoardProviders } from "./api";
import { type ContractAddress } from "@midnight-ntwrk/compact-runtime";
import {
  BehaviorSubject,
  type Observable,
  concatMap,
  filter,
  firstValueFrom,
  interval,
  map,
  of,
  take,
  tap,
  throwError,
  timeout,
  catchError,
} from "rxjs";
import { pipe as fnPipe } from "fp-ts/function";
import pino, { type Logger } from "pino";
import { type DAppConnectorAPI, type DAppConnectorWalletAPI, type ServiceUriConfig } from "@midnight-ntwrk/dapp-connector-api";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { type BalancedTransaction, type UnbalancedTransaction, createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { type CoinInfo, type TransactionId } from "@midnight-ntwrk/ledger";
import semver from "semver";
import { type NetworkId } from "@midnight-ntwrk/midnight-js-network-id";

const networkId = process.env.NEXT_PUBLIC_NETWORK_ID as NetworkId;
export const logger = pino({
  level: process.env.NEXT_PUBLIC_LOGGING_LEVEL as string,
});
logger.trace("networkId = ", networkId);

export interface InProgressBoardDeployment {
  readonly status: "in-progress";
}

export interface DeployedBoardDeployment {
  readonly status: "deployed";
  readonly api: DeployedBBoardAPI;
}

export interface FailedBoardDeployment {
  readonly status: "failed";
  readonly error: Error;
}

export type BoardDeployment = InProgressBoardDeployment | DeployedBoardDeployment | FailedBoardDeployment;

export interface DeployedQuetionsAPIProvider {
  boardDeployment$: Observable<BoardDeployment>;
  readonly resolveTitle: (title: string, contractAddress?: ContractAddress) => Promise<Observable<BoardDeployment>>;
  readonly resolveAddress: (contractAddress: ContractAddress) => void;
}

export class BrowserDeployedQuetionsManager implements DeployedQuetionsAPIProvider {
  #initializedProviders: Promise<BBoardProviders> | undefined;
  boardDeployment$: Observable<BoardDeployment>;

  constructor(private readonly logger: Logger) {
    this.boardDeployment$ = new BehaviorSubject<BoardDeployment>({ status: "in-progress" });
  }

  async resolveTitle(title: string) {
    const deployment = this.boardDeployment$ as BehaviorSubject<BoardDeployment>;
    const result = await this.deployDeployment(deployment, title);
    return result;
  }

  resolveAddress(contractAddress: ContractAddress) {
    const deployment = this.boardDeployment$ as BehaviorSubject<BoardDeployment>;
    void this.joinDeployment(deployment, contractAddress);
  }

  private getProviders(): Promise<BBoardProviders> {
    return this.#initializedProviders ?? (this.#initializedProviders = initializeProviders(this.logger));
  }

  private async deployDeployment(deployment: BehaviorSubject<BoardDeployment>, title: string): Promise<Observable<BoardDeployment>> {
    try {
      const { BBoardAPI } = await import("./api");
      const providers = await this.getProviders();
      const api = await BBoardAPI.deploy(providers, title, this.logger);

      deployment.next({
        status: "deployed",
        api,
      });
      this.boardDeployment$ = deployment;
      return deployment;
    } catch (error: unknown) {
      deployment.next({
        status: "failed",
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return deployment;
    }
  }

  private async joinDeployment(deployment: BehaviorSubject<BoardDeployment>, contractAddress: ContractAddress): Promise<void> {
    try {
      const { BBoardAPI } = await import("./api");
      const providers = await this.getProviders();
      const api = await BBoardAPI.join(providers, contractAddress, this.logger);

      deployment.next({
        status: "deployed",
        api,
      });
      this.boardDeployment$ = deployment;
    } catch (error: unknown) {
      deployment.next({
        status: "failed",
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

/** @internal */
const initializeProviders = async (logger: Logger): Promise<BBoardProviders> => {
  const { levelPrivateStateProvider } = await import("@midnight-ntwrk/midnight-js-level-private-state-provider");
  const { httpClientProofProvider } = await import("@midnight-ntwrk/midnight-js-http-client-proof-provider");
  const { indexerPublicDataProvider } = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");
  const { Transaction } = await import("@midnight-ntwrk/ledger");
  const { wallet, uris } = await connectToWallet(logger);
  const walletState = await wallet.state();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "bboard-private-state",
    }),
    zkConfigProvider: new FetchZkConfigProvider(window.location.origin, fetch.bind(window)),
    proofProvider: httpClientProofProvider(uris.proverServerUri),
    publicDataProvider: indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
    walletProvider: {
      coinPublicKey: walletState.coinPublicKey,
      async balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
        const balanceTx = await wallet.balanceTransaction(tx.tx, newCoins);
        const proveTx = await wallet.proveTransaction(balanceTx);

        return createBalancedTx(Transaction.deserialize(proveTx.serialize()));
      },
    },
    midnightProvider: {
      submitTx(tx: BalancedTransaction): Promise<TransactionId> {
        return wallet.submitTransaction(tx.tx);
      },
    },
  };
};

/** @internal */
const connectToWallet = (logger: Logger): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
  const COMPATIBLE_CONNECTOR_API_VERSION = "1.x";

  return firstValueFrom(
    fnPipe(
      interval(100),
      map(() => window.midnight?.mnLace),
      tap((connectorAPI) => {
        logger.info(connectorAPI, "Check for wallet connector API");
      }),
      filter((connectorAPI): connectorAPI is DAppConnectorAPI => !!connectorAPI),
      concatMap((connectorAPI) =>
        semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
          ? of(connectorAPI)
          : throwError(() => {
              logger.error(
                {
                  expected: COMPATIBLE_CONNECTOR_API_VERSION,
                  actual: connectorAPI.apiVersion,
                },
                "Incompatible version of wallet connector API"
              );

              return new Error(
                `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}', got '${connectorAPI.apiVersion}'.`
              );
            })
      ),
      tap((connectorAPI) => {
        logger.info(connectorAPI, "Compatible wallet connector API found. Connecting.");
      }),
      take(1),
      timeout({
        first: 1_000,
        with: () =>
          throwError(() => {
            logger.error("Could not find wallet connector API");

            return new Error("Could not find Midnight Lace wallet. Extension installed?");
          }),
      }),
      concatMap(async (connectorAPI) => {
        const isEnabled = await connectorAPI.isEnabled();

        logger.info(isEnabled, "Wallet connector API enabled status");

        return connectorAPI;
      }),
      timeout({
        first: 5_000,
        with: () =>
          throwError(() => {
            logger.error("Wallet connector API has failed to respond");

            return new Error("Midnight Lace wallet has failed to respond. Extension enabled?");
          }),
      }),
      concatMap(async (connectorAPI) => ({ walletConnectorAPI: await connectorAPI.enable(), connectorAPI })),
      catchError((error, apis) =>
        error
          ? throwError(() => {
              logger.error("Unable to enable connector API");
              return new Error("Application is not authorized");
            })
          : apis
      ),
      concatMap(async ({ walletConnectorAPI, connectorAPI }) => {
        const uris = await connectorAPI.serviceUriConfig();

        logger.info("Connected to wallet connector API and retrieved service configuration");

        return { wallet: walletConnectorAPI, uris };
      })
    )
  );
};
