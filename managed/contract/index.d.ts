import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  localShareBalance(context: __compactRuntime.WitnessContext<Ledger, PS>,
                    offeringId_0: bigint): [PS, bigint];
  sessionNonce(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  investorCommitment(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  creatorCommitment(context: __compactRuntime.WitnessContext<Ledger, PS>,
                    offeringId_0: bigint): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  createFraction(context: __compactRuntime.CircuitContext<PS>,
                 metadataHashBytes_0: Uint8Array,
                 totalShares_0: bigint,
                 sharePrice_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  buyShares(context: __compactRuntime.CircuitContext<PS>,
            offeringId_0: bigint,
            sharesToBuy_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  sellShares(context: __compactRuntime.CircuitContext<PS>,
             offeringId_0: bigint,
             sharesToSell_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  transferShares(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint,
                 sharesToTransfer_0: bigint,
                 recipientCommitment_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimOwnership(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyOwnership(context: __compactRuntime.CircuitContext<PS>,
                  offeringId_0: bigint,
                  minimumShares_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  cancelOffering(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeOffering(context: __compactRuntime.CircuitContext<PS>,
                offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createFraction(context: __compactRuntime.CircuitContext<PS>,
                 metadataHashBytes_0: Uint8Array,
                 totalShares_0: bigint,
                 sharePrice_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  buyShares(context: __compactRuntime.CircuitContext<PS>,
            offeringId_0: bigint,
            sharesToBuy_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  sellShares(context: __compactRuntime.CircuitContext<PS>,
             offeringId_0: bigint,
             sharesToSell_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  transferShares(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint,
                 sharesToTransfer_0: bigint,
                 recipientCommitment_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimOwnership(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyOwnership(context: __compactRuntime.CircuitContext<PS>,
                  offeringId_0: bigint,
                  minimumShares_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  cancelOffering(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeOffering(context: __compactRuntime.CircuitContext<PS>,
                offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createFraction(context: __compactRuntime.CircuitContext<PS>,
                 metadataHashBytes_0: Uint8Array,
                 totalShares_0: bigint,
                 sharePrice_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  buyShares(context: __compactRuntime.CircuitContext<PS>,
            offeringId_0: bigint,
            sharesToBuy_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  sellShares(context: __compactRuntime.CircuitContext<PS>,
             offeringId_0: bigint,
             sharesToSell_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  transferShares(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint,
                 sharesToTransfer_0: bigint,
                 recipientCommitment_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimOwnership(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyOwnership(context: __compactRuntime.CircuitContext<PS>,
                  offeringId_0: bigint,
                  minimumShares_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  cancelOffering(context: __compactRuntime.CircuitContext<PS>,
                 offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeOffering(context: __compactRuntime.CircuitContext<PS>,
                offeringId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly offeringCount: bigint;
  offeringMetadataHash: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  offeringTotalShares: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  offeringSharePrice: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  offeringStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  offeringSoldShares: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  offeringCreatorCommitment: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
