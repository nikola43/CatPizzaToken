import { BigNumber, Contract, Wallet } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { randomBytes } from 'crypto'
import fs from "fs";
import { artifacts, network } from "hardhat";

const { ethers, upgrades } = require('hardhat')
const { parseEther, formatEther } = ethers.utils
const { getImplementationAddress } = require('@openzeppelin/upgrades-core')
import hre from 'hardhat'

const provider = ethers.provider
import colors from "colors";

let default_chain: string = process.env.CHAIN ?? 'bsc';

export const chains: Record<string, Record<string, any>> = {
    avalanche: {
        dex: 'Pangolin',
        router: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
        factory: '0xE4A575550C2b460d2307b82dCd7aFe84AD1484dd',
        wChainCoin: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
        methods: {
            addLiquidity: 'addLiquidityAVAX',
        }
    },
    bsc: {
        dex: 'Pancake',
        router: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
        factory: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc",
        wChainCoin: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        BUSD: "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
        whaleBUSD: "0x352a7a5277ec7619500b06fa051974621c1acd12",
        methods: {
            addLiquidity: 'addLiquidity',
        }
    }
}

export function getRouterName(dex: string) {
    return `${dex}Router`;
}

export function getPairName(dex: string) {
    return `${dex}Pair`;
}

export function getFactoryName(dex: string) {
    return `${dex}Factory`;
}

export async function getProxyImplementation(proxyAddress: string): Promise<string> {
    return await getImplementationAddress(provider, proxyAddress)
}

export async function connectRouter(): Promise<Contract> {
    return await ethers.getContractAt(
        getRouterName(chains[default_chain]?.dex),
        chains[default_chain]?.router
    )
}

export async function connectBUSD(): Promise<Contract> {
    //wtf is this not working -> Forgot to await on test bruh
    return await ethers.getContractAt(
        'BEP20Token',
        chains[default_chain]?.BUSD ?? chains[default_chain]?.wChainCoin)
}

export async function connectWBNB(): Promise<Contract> {
    return await ethers.getContractAt('WBNB', chains?.bsc?.wChainCoin)
}

export async function connectWAVAX(): Promise<Contract> {
    return await ethers.getContractAt('WAVAX', chains?.avalanche?.wChainCoin)
}

export async function connectPair(pairAddress: string): Promise<Contract> {
    return await ethers.getContractAt(getPairName(chains[default_chain]?.dex), pairAddress)
}

export async function connectFactory(): Promise<Contract> {
    return await ethers.getContractAt(
        getFactoryName(chains[default_chain]?.dex),
        chains[default_chain]?.factory
    )
}

export async function deployLFG(): Promise<Contract> {
    const LFGFactory = await ethers.getContractFactory('LIFEGAMESV2')
    const TokenDeployed = await upgrades.deployProxy(LFGFactory, {
        initializer: 'initialize'
    })
    const r = await TokenDeployed.deployed()
    console.log(r)
    return r
}

export async function connectToken(): Promise<Contract> {
    return await ethers.getContractAt(
        'TokenV1',
        '0xD1586f4624775920121A0D58A785F46e9f91500d'
    )
}

export const updateABI = async (contractName: string) => {
    const abiDir = `${__dirname}/../abi`;
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir);
    }
    const Artifact = artifacts.readArtifactSync(contractName);
    fs.writeFileSync(
        `${abiDir}/${contractName}.json`,
        JSON.stringify(Artifact.abi, null, 2)
    )
}


export const deployProxyInitialize = async (contractName: string, autoVerify: boolean = true, args: any = []): Promise<Contract> => {
    /*
    const Token = await ethers.getContractFactory("TokenV1");
    const TokenDeployed = await upgrades.deployProxy(Token, {
     initializer: "initialize",
    });
    await TokenDeployed.deployed();
    await getImplementationAddress(ethers.provider,TokenDeployed.address)
    console.log("Contract deployed to:", TokenDeployed.address);
    */


    const factory = await ethers.getContractFactory(contractName)
    const contract = args.length > 1 ? await upgrades.deployProxy(factory, [args], {
        initializer: "initialize",
    }) : await upgrades.deployProxy(factory, args, {
        initializer: "initialize",
    })
    const token = await contract.deployed()
    const implAddress = await getImplementationAddress(ethers.provider, token.address);
    await updateABI(contractName)
    if (autoVerify) {
        console.log('\nVerifing')
        await verify(implAddress, args)
    }
    console.log(contractName, token.address, implAddress)
    return token
}

export const verify = async (contractAddress: string, args = []) => {
    // @ts-ignore
    if (network == 'localhost' || network == 'hardhat') return
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (ex) {
    }
}

export const deployProxy = async (contractName: string, args = []): Promise<Contract> => {
    const factory = await ethers.getContractFactory(contractName)
    const contract = await upgrades.deployProxy(factory, args)
    const token = await contract.deployed()
    const implAddress = await getImplementationAddress(ethers.provider, token.address);
    await updateABI(contractName)
    await verify(implAddress, args)
    console.log(contractName, token.address, implAddress)
    return token
}

export async function fundBUSD(busdContract: Contract, router: Contract, user: SignerWithAddress, amount: any) {
    const whale = chains?.bsc?.whaleBUSD
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [whale],
    });

    const signer = await ethers.getSigner(whale)
    const busdBalance = await busdContract.balanceOf(whale)
    console.log("whale dai balance", formatEther(busdBalance))

    await busdContract.connect(signer).transfer(user.address, parseEther(amount))
    await busdContract.connect(user).approve(router.address, ethers.constants.MaxUint256);
    await busdContract.connect(user).approve(busdContract.address, ethers.constants.MaxUint256);
    console.log("fund with BUSD:", formatEther(await busdContract.balanceOf(user.address)));
    console.log();
}

export async function swapApproveBNBtoBUSD(tokenBUSD: Contract, router: Contract, user: SignerWithAddress, _value: any) {
    await router.connect(user).swapExactETHForTokens(
        0, //amountOutMin
        [chains?.bsc?.wChainCoin, chains?.bsc?.BUSD], //path
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
        { value: _value }
    )
    const busdBalance = await tokenBUSD.balanceOf(user.address)
    //console.log('busdBalance', formatEther(busdBalance))
    await tokenBUSD.connect(user).approve(router.address, busdBalance);
    await tokenBUSD.connect(user).approve(tokenBUSD.address, busdBalance);
}

export async function approveAndAddBusdLiquidity(token: Contract, router: Contract, user: SignerWithAddress, aAmount: any, bAmount: any) {
    await token.approve(chains?.bsc?.router, bAmount)
    const tx = await router.connect(user).addLiquidity(
        chains?.bsc?.BUSD,      // A
        token.address,            // B
        aAmount,                  // amountADesired
        bAmount,                  // amountBDesired
        0,                        // mins to revert
        0,
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
    )
    console.log(`${colors.cyan('Tx ')}: ${colors.yellow(tx)}`)
}

export async function approveAndAddBNBLiquidity(token: Contract, router: Contract, user: SignerWithAddress, aAmount: any, bAmount: any) {
    await token.approve(chains?.bsc?.router, bAmount)
    const tx = await router.connect(user).addLiquidity(
        chains?.bsc?.wChainCoin,      // A
        token.address,            // B
        aAmount,                  // amountADesired
        bAmount,                  // amountBDesired
        0,                        // mins to revert
        0,
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
    )
    console.log(`${colors.cyan('Tx ')}: ${colors.yellow(tx)}`)
}

export async function addLiqLFG(deployer: SignerWithAddress, busdContract: Contract, router: Contract, token: Contract) {
    await fundBUSD(busdContract, router, deployer, "400000")
    await swapApproveBNBtoBUSD(busdContract, router, deployer, parseEther('100'))
    const busdBalance = await busdContract.balanceOf(deployer.address)
    console.log(formatEther(busdBalance))

    await approveAndAddBusdLiquidity(token, router, deployer, busdBalance, parseEther("100"))

}

export async function addTempLiquidityLFG(deployer: SignerWithAddress, busdContract: Contract, router: Contract, token: Contract) {
    //await swapApproveBNBtoBUSD(busdContract, router, deployer, parseEther('100'))
    const busdBalance = await busdContract.balanceOf(deployer.address)
    console.log(formatEther(busdBalance))

    await approveAndAddBusdLiquidity(token, router, deployer, busdBalance, parseEther("10"))
}

export async function approveAndAddLiquidity(
    tokenA: string,
    tokenB: string,
    router: Contract,
    user: SignerWithAddress,
    aAmount: BigNumber,
    bAmount: BigNumber
) {
    const tx = await router.connect(user).addLiquidity(
        tokenA, // B
        tokenB, // B
        aAmount, // amountADesired
        aAmount, // amountBDesired
        bAmount, // mins to revert
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
        {
            value: bAmount,
        }
    )
    console.log(`${colors.cyan('Tx ')}: ${colors.yellow(tx)}`)
}

/**
 * BUYS LFG USING PANCAKE ROUTER
 * @param {Contract} token - LFG Token
 * @param {Contract} router - Pancake Router
 * @param {Signer} user - User that is swapping
 * @param {BigNumber} amountBUSD - Amount of BUSD used to buy
 *
 *
 */
export async function buyLFG(
    tokenBUSD: Contract,
    token: Contract,
    router: Contract,
    user: SignerWithAddress,
    amountBUSD: any
) {
    await tokenBUSD.connect(user).approve(router.address, amountBUSD)
    await token
        .connect(user)
        .approve(router.address, ethers.constants.MaxUint256);
    return new Promise(async (resolve, reject) => {
        await router.connect(user).swapExactTokensForTokens(
            amountBUSD, // amountIn
            1, //amountOutMin
            [chains[default_chain]?.BUSD ?? chains[default_chain]?.wChainCoin, token.address], //path
            user.address,
            2648069985 // Saturday, 29 November 2053 22:59:45
        ).then((data: any, err: any) => {
            if (data) {
                resolve(data);
            }
            reject(err);
        })
            .catch((err: any) => {
                reject(err);
            });
    });
}

/**
 * BUYS LFG USING PANCAKE ROUTER
 * @param {Contract} token - LFG Token
 * @param {Contract} router - Pancake Router
 * @param {Signer} user - User that is swapping
 * @param {BigNumber} amountBUSD - Amount of BUSD used to buy
 *
 *
 */
export async function swapExactTokensForAVAXSupportingFeeOnTransferTokens(
    token: Contract,
    router: Contract,
    user: SignerWithAddress,
    amount: BigNumber
) {
    await token.connect(user).approve(router.address, amount)
    await router
        .connect(user)
        .swapExactTokensForAVAXSupportingFeeOnTransferTokens(
            amount, // amountIn
            1, //amountOutMin
            [token.address, chains?.avalanche?.wChainCoin], //path
            user.address,
            2648069985 // Saturday, 29 November 2053 22:59:45
        )
    // APROVE MAX TOKENS
    //await token.connect(user).approve(router.address, ethers.constants.MaxUint256)
}

export async function sellLFG(token: Contract, router: Contract, user: SignerWithAddress, amountLFG: any) {
    await token.connect(user).approve(router.address, amountLFG);
    await router.connect(user).swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountLFG, // amountIn
        1, //amountOutMin
        [token.address, chains?.bsc?.BUSD], //path
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
    )
}

export const percentage = (val_one: number, val_two: number) => {
    return 100 - Math.floor(val_one * 100 / val_two)
}

export async function diff(expected: any, actual: any) {
    return Number((actual / formatEther(expected)) * 100 - 100)
}

export async function diffInverse(expected: any, actual: any) {
    return Number((formatEther(actual) / expected) * 100 - 100)
}

export async function roundDiff(expected: any, actual: any) {
    return Math.round((Math.abs(expected) / ((expected + actual) / 2)) * 100)
    //return (actual / (expected * 100) - 100)
}

export function compareTokenBalance(balanceBefore: BigNumber, balanceAfter: BigNumber) {
    const formatBalanceBefore = formatEther(balanceBefore)
    const formatBalanceAfter = formatEther(balanceAfter)

    if (balanceAfter < balanceBefore) {
        console.log(`${colors.yellow('Token Balance Before')}: ${colors.green(formatBalanceBefore)}`)
        console.log(`${colors.cyan('Token Balance After')}:  ${colors.red(formatBalanceAfter)}`)
    } else if (balanceAfter > balanceBefore) {
        console.log(`${colors.yellow('Token Balance Before')}: ${colors.red(formatBalanceBefore)}`)
        console.log(`${colors.cyan('Token Balance After')}:  ${colors.green(formatBalanceAfter)}`)
    } else {
        console.log(`${colors.yellow('Token Balance Before')}: ${colors.gray(formatBalanceBefore)}`)
        console.log(`${colors.cyan('Token Balance After')}:  ${colors.gray(formatBalanceAfter)}`)
    }
}

export function generateRandomAddresses(n: number): string[] {
    return new Array(n)
        .fill(0)
        .map(() => new Wallet(randomBytes(32).toString('hex')).address)
}

export function generateRandomAmount(max: number): BigNumber {
    return parseEther(randomNumber(1, max).toString())
}

export const randomNumber = (min: number, max: number) => {
    //Use below if final number doesn't need to be whole number
    //return Math.random() * (max - min) + min
    return Math.floor(Math.random() * (max - min) + min)
}

export const bscTestnet = {
    router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
    factory: '0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc',
    whaleBUSD: "0x352a7a5277ec7619500b06fa051974621c1acd12",
    BUSD: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
}

/*
const avalancheFujiTestnet = {
    router: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
    factory: '0xE4A575550C2b460d2307b82dCd7aFe84AD1484dd',
    WAVAX: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
}
*/

// async function approveAndAddLiquidityBNB(user, BNBamount, TokenAmount){
//     await token.approve(util.pancakeTestnet.router, TokenAmount)
//     const tx = await router.connect(user).addLiquidityETH(
//         token.address,
//         TokenAmount,
//         0,
//         0,
//         user.address,
//         2648069985, // Saturday, 29 November 2053 22:59:45
//         {value: BNBamount}
//     )
// }
