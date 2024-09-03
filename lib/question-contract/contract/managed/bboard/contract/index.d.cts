import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum STATE { vacant = 0, occupied = 1 }

export type Witnesses<T> = {
  local_secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  post(context: __compactRuntime.CircuitContext<T>, message: string): __compactRuntime.CircuitResults<T, void>;
  take_down(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, string>;
}

export type PureCircuits = {
  public_key(sk: Uint8Array, instance: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  post(context: __compactRuntime.CircuitContext<T>, message: string): __compactRuntime.CircuitResults<T, void>;
  take_down(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, string>;
  public_key(context: __compactRuntime.CircuitContext<T>,
             sk: Uint8Array,
             instance: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly state: STATE;
  readonly title: string;
  readonly message: { is_some: boolean, value: string };
  readonly instance: bigint;
  readonly poster: Uint8Array;
}

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(privateState: T, title: string): [T, __compactRuntime.ContractState];
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
