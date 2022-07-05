/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IUniswapV2Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Factory__factory>;
    getContractFactory(
      name: "IUniswapV2Router01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router01__factory>;
    getContractFactory(
      name: "IUniswapV2Router02",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router02__factory>;
    getContractFactory(
      name: "BEP20Token",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BEP20Token__factory>;
    getContractFactory(
      name: "Context",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Context__factory>;
    getContractFactory(
      name: "IBEP20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBEP20__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IPancakeCallee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeCallee__factory>;
    getContractFactory(
      name: "IPancakeERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeERC20__factory>;
    getContractFactory(
      name: "IPancakeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeFactory__factory>;
    getContractFactory(
      name: "IPancakePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakePair__factory>;
    getContractFactory(
      name: "PancakeERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PancakeERC20__factory>;
    getContractFactory(
      name: "PancakeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PancakeFactory__factory>;
    getContractFactory(
      name: "PancakePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PancakePair__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IPancakeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeFactory__factory>;
    getContractFactory(
      name: "IPancakePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakePair__factory>;
    getContractFactory(
      name: "IPancakeRouter01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeRouter01__factory>;
    getContractFactory(
      name: "IPancakeRouter02",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPancakeRouter02__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "PancakeRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PancakeRouter__factory>;
    getContractFactory(
      name: "WBNB",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WBNB__factory>;
    getContractFactory(
      name: "MetaStocks",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MetaStocks__factory>;

    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IUniswapV2Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Factory>;
    getContractAt(
      name: "IUniswapV2Router01",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router01>;
    getContractAt(
      name: "IUniswapV2Router02",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router02>;
    getContractAt(
      name: "BEP20Token",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BEP20Token>;
    getContractAt(
      name: "Context",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Context>;
    getContractAt(
      name: "IBEP20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBEP20>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IPancakeCallee",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeCallee>;
    getContractAt(
      name: "IPancakeERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeERC20>;
    getContractAt(
      name: "IPancakeFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeFactory>;
    getContractAt(
      name: "IPancakePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakePair>;
    getContractAt(
      name: "PancakeERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PancakeERC20>;
    getContractAt(
      name: "PancakeFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PancakeFactory>;
    getContractAt(
      name: "PancakePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PancakePair>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IPancakeFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeFactory>;
    getContractAt(
      name: "IPancakePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakePair>;
    getContractAt(
      name: "IPancakeRouter01",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeRouter01>;
    getContractAt(
      name: "IPancakeRouter02",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPancakeRouter02>;
    getContractAt(
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "PancakeRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PancakeRouter>;
    getContractAt(
      name: "WBNB",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WBNB>;
    getContractAt(
      name: "MetaStocks",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MetaStocks>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
