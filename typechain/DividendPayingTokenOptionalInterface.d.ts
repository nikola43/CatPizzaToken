/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface DividendPayingTokenOptionalInterfaceInterface
  extends ethers.utils.Interface {
  functions: {
    "accumulativeDividendOf(address)": FunctionFragment;
    "withdrawableDividendOf(address)": FunctionFragment;
    "withdrawnDividendOf(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accumulativeDividendOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawableDividendOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawnDividendOf",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "accumulativeDividendOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawableDividendOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawnDividendOf",
    data: BytesLike
  ): Result;

  events: {};
}

export class DividendPayingTokenOptionalInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DividendPayingTokenOptionalInterfaceInterface;

  functions: {
    accumulativeDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdrawableDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdrawnDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  accumulativeDividendOf(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdrawableDividendOf(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdrawnDividendOf(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    accumulativeDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawableDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawnDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    accumulativeDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawableDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawnDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accumulativeDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawableDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawnDividendOf(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}