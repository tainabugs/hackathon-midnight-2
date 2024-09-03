"use client";

import { type NetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { setNetworkId } from "@midnight-ntwrk/compact-runtime";
import { useEffect } from "react";

interface MidnightWrapperProps {
  children: React.ReactNode;
}

export const MidnightWrapper = ({ children }: MidnightWrapperProps) => {
  const networkId = process.env.NEXT_PUBLIC_NETWORK_ID as NetworkId;

  useEffect(() => {
    const run = async () => {
      const { toLedgerNetworkId, toRuntimeNetworkId, toZswapNetworkId } = await import("@midnight-ntwrk/midnight-js-network-id");    
      const { setNetworkId : zwapSetNetworkId } = await import("@midnight-ntwrk/zswap");
      const { setNetworkId : ledgerSetNetworkId } = await import("@midnight-ntwrk/ledger");
      // Ensure that the network IDs are set within the Midnight libraries.
      setNetworkId(toRuntimeNetworkId(networkId));
      zwapSetNetworkId(toZswapNetworkId(networkId));
      ledgerSetNetworkId(toLedgerNetworkId(networkId));
    };
    run();
  }, []);

  return <>{children}</>;
};
