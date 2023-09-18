import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerBid = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bid, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price: number;
  readonly auctionId: string;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBid = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bid, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price: number;
  readonly auctionId: string;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Bid = LazyLoading extends LazyLoadingDisabled ? EagerBid : LazyBid

export declare const Bid: (new (init: ModelInit<Bid>) => Bid) & {
  copyOf(source: Bid, mutator: (draft: MutableModel<Bid>) => MutableModel<Bid> | void): Bid;
}