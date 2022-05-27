//import { Signer } from '@ethersproject/abstract-signer'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ExecException } from 'child_process'
import colors from 'colors'
import { randomBytes } from 'crypto'
import { BigNumber, Contract, Wallet } from 'ethers'
import fs from 'fs'
import { artifacts, network } from 'hardhat'
import hre from 'hardhat'

const { ethers, upgrades } = require('hardhat')
const { parseEther, formatEther } = ethers.utils
const { getImplementationAddress } = require('@openzeppelin/upgrades-core')

const provider = ethers.provider
const os = require('os')

async function getProxyImplementation(proxyAddress: string): Promise<string> {
  return await getImplementationAddress(provider, proxyAddress)
}

async function connectRouter(): Promise<Contract> {
  return await ethers.getContractAt(
    'PangolinRouter',
    avalancheFujiTestnet.router
  )
}

// async function connectBUSD(): Promise<Contract> {
//   //wtf is this not working -> Forgot to await on test bruh
//   return await ethers.getContractAt('BEP20Token', avalancheFujiTestnet.WAVAX)
// }

async function connectWAVAX(): Promise<Contract> {
  return await ethers.getContractAt('WAVAX', avalancheFujiTestnet.WAVAX)
}

async function connectPair(pairAddress: string): Promise<Contract> {
  return await ethers.getContractAt('PangolinPair', pairAddress)
}

async function connectFactory(): Promise<Contract> {
  return await ethers.getContractAt(
    'PangolinFactory',
    avalancheFujiTestnet.factory
  )
}

function compareETHBalance(balanceBefore: BigNumber, balanceAfter: BigNumber) {
  const formatBalanceBefore = formatEther(balanceBefore)
  const formatBalanceAfter = formatEther(balanceAfter)
  if (balanceAfter < balanceBefore) {
    console.log(
      `${colors.green(formatBalanceBefore)} -> ${colors.red(
        formatBalanceAfter
      )}`
    )
  } else if (balanceAfter > balanceBefore) {
    console.log(
      `${colors.red(formatBalanceBefore)} -> ${colors.green(
        formatBalanceAfter
      )}`
    )
  } else {
    console.log(
      `${colors.gray(formatBalanceBefore)} -> ${colors.gray(
        formatBalanceAfter
      )}`
    )
  }
  console.log()
}

// async function connectToken(
//   contractName: string,
//   tokenAddress: string
// ): Promise<Contract> {
//   return await ethers.getContractAt(contractName, tokenAddress)
// }

const updateABI = async (contractName: string) => {
  const abiDir = `${__dirname}/../abi`
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir)
  }
  const Artifact = artifacts.readArtifactSync(contractName)
  fs.writeFileSync(
    `${abiDir}/${contractName}.json`,
    JSON.stringify(Artifact.abi, null, 2)
  )
}

const verify = async (contractAddress: string, args: any = []) => {
  // @ts-ignore
  if (network == 'localhost' || network == 'hardhat') return
  try {
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: args
    })
  } catch (ex) {}
}
const deployProxyV2 = async (
  contractName: string,
  autoVerify = true,
  args: any = []
): Promise<Contract> => {
  const factory = await ethers.getContractFactory(contractName)
  const contract =
    args.length > 1
      ? await upgrades.deployProxy(factory, [args], {
          initializer: 'initialize'
        })
      : await upgrades.deployProxy(factory, args, {
          initializer: 'initialize'
        })
  const token = await contract.deployed()
  const implAddress = await getImplementationAddress(
    ethers.provider,
    token.address
  )
  await updateABI(contractName)

  if (autoVerify) {
    console.log('\nVerifing')
    await verify(implAddress, args)
  }

  console.log(contractName, token.address, implAddress)
  return token
}

const deployProxyInitialize = async (
  contractName: string,
  autoVerify = true,
  args: any = []
): Promise<Contract> => {
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
  const contract =
    args.length > 1
      ? await upgrades.deployProxy(factory, [args], {
          initializer: 'initialize'
        })
      : await upgrades.deployProxy(factory, args, {
          initializer: 'initialize'
        })
  const token = await contract.deployed()
  const implAddress = await getImplementationAddress(
    ethers.provider,
    token.address
  )
  await updateABI(contractName)
  if (autoVerify) {
    console.log('\nVerifing')
    await verify(implAddress, args)
  }
  console.log(contractName, token.address, implAddress)
  return token
}

const verifyToken = async (
  contract: Contract,
  args: any = []
): Promise<Contract> => {
  const tokenImplementationAddress = await getImplementationAddress(
    ethers.provider,
    contract.address
  )

  //await updateABI(contractName)

  console.log('\nVerifing')
  await verify(tokenImplementationAddress, args)

  console.log(contract.address, tokenImplementationAddress)
  return contract
}

const verifyWithotDeploy = async (
  contractName: string,
  contract: Contract,
  autoVerify = true,
  args: any = []
) => {
  /*
    const Token = await ethers.getContractFactory("TokenV1");
    const TokenDeployed = await upgrades.deployProxy(Token, {
     initializer: "initialize",
    });
    await TokenDeployed.deployed();
    await getImplementationAddress(ethers.provider,TokenDeployed.address)
    console.log("Contract deployed to:", TokenDeployed.address);
    */

  const tokenImplementationAddress = await getImplementationAddress(
    ethers.provider,
    contract.address
  )
  console.log(`Token Address: ${contract.address}`)
  console.log(`Implementation Address: ${tokenImplementationAddress}`)

  await updateABI(contractName)
  if (autoVerify) {
    console.log('\nVerifing... ' + tokenImplementationAddress)
    await verify(tokenImplementationAddress, args)
  }
}

const deployProxy = async (
  contractName: string,
  autoVerify = true,
  args: any = []
): Promise<Contract> => {
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
  const contract =
    args.length > 1
      ? await upgrades.deployProxy(factory, [args])
      : await upgrades.deployProxy(factory, args)
  const token = await contract.deployed()
  const implAddress = await getImplementationAddress(
    ethers.provider,
    token.address
  )
  await updateABI(contractName)
  if (autoVerify) {
    console.log('\nVerifing')
    await verify(implAddress, args)
  }
  console.log(contractName, token.address, implAddress)
  return token
}

/*
// ! TODO refactor this awful shit - called from tests
async function swapApproveAVAXtoToken(tokenBUSD: Contract, router: Contract, user: SignerWithAddress, _value: any) {
    await router.connect(user).swapExactETHForTokens(
        0, //amountOutMin
        [avalancheFujiTestnet.WAVAX, avalancheFujiTestnet.BUSD], //path
        user.address,
        2648069985, // Saturday, 29 November 2053 22:59:45
        {value: _value}
    )
    const busdBalance = await tokenBUSD.balanceOf(user.address)
    //console.log('busdBalance', formatEther(busdBalance))
    await tokenBUSD.connect(user).approve(router.address, busdBalance)
    await tokenBUSD.connect(user).approve(tokenBUSD.address, busdBalance)
}
*/

async function addLiquidityAVAX(
  token: Contract,
  router: Contract,
  user: SignerWithAddress,
  aAmount: BigNumber,
  bAmount: BigNumber
) {
  await token.approve(avalancheFujiTestnet.router, aAmount)
  const tx = await router.connect(user).addLiquidityAVAX(
    token.address, // B
    aAmount, // amountADesired
    aAmount, // amountBDesired
    bAmount, // mins to revert
    user.address,
    2648069985, // Saturday, 29 November 2053 22:59:45
    {
      value: bAmount
    }
  )

  console.log('Tx ID: ', tx.hash)
}

/**
 * BUYS TOKEN USING PANCAKE ROUTER
 * @param {Contract} token - Test Token
 * @param {Contract} router - Pancake Router
 * @param {Signer} user - User that is swapping
 * @param {BigNumber} amountBUSD - Amount of BUSD used to buy
 *
 *
 */
async function swapExactTokensForAVAX(
  token: Contract,
  router: Contract,
  user: SignerWithAddress,
  amount: string,
  slippage: number
) {
  console.log(
    `${colors.cyan('amount')}:   ${colors.green(
      formatEther(parseEther(amount))
    )}`
  )
  console.log(
    `${colors.cyan('slippage')}:  ${colors.green(slippage.toString())}`
  )

  const routerPath = [token.address, avalancheFujiTestnet.WAVAX]
  const amount_out: BigNumber = parseEther(amount)
  const amount_out_min: BigNumber[] = await router.getAmountsIn(
    amount_out,
    routerPath
  )
  const amount_out_min_tokens: BigNumber | undefined = amount_out_min[0]

  console.log(`${colors.cyan('routerPath')}:  ${routerPath}`)
  console.log(
    `${colors.cyan('amount_out')}:  ${colors.green(formatEther(amount_out))}`
  )
  console.log(
    `${colors.cyan('amount_out_min[0]')}:  ${colors.green(
      formatEther(amount_out_min[0])
    )}`
  )
  console.log(
    `${colors.cyan('amount_out_min[1]')}:   ${colors.green(
      formatEther(amount_out_min[1])
    )}`
  )
  console.log(
    `${colors.cyan('amount_out_min_tokens')}:  ${colors.green(
      formatEther(amount_out_min_tokens)
    )}`
  )

  const amountLessSlippage = Number(amount) - (Number(amount) * slippage) / 100
  console.log(
    `${colors.cyan('amountLessSlippage')}:  ${colors.green(
      amountLessSlippage.toString()
    )}`
  )

  await token.connect(user).approve(router.address, amount)
  const tx = await router.connect(user).swapExactTokensForAVAX(
    amount_out, // amountIn
    amount_out_min_tokens, //amountOutMin
    routerPath, //path
    user.address,
    2648069985 // Saturday, 29 November 2053 22:59:45
  )
  // APROVE MAX TOKENS
  //await token.connect(user).approve(router.address, ethers.constants.MaxUint256)
  console.log('Tx ID: ', tx.hash)
}

async function swapExactTokensForAVAXSupportingFeeOnTransferTokens(
  token: Contract,
  router: Contract,
  user: SignerWithAddress,
  amount: string
) {
  const amount_out: BigNumber = parseEther(amount)
  await token.connect(user).approve(router.address, amount)
  const tx = await router
    .connect(user)
    .swapExactTokensForAVAXSupportingFeeOnTransferTokens(
      amount_out, // amountIn
      1, //amountOutMin
      [token.address, avalancheFujiTestnet.WAVAX], //path
      user.address,
      2648069985 // Saturday, 29 November 2053 22:59:45
    )
  // APROVE MAX TOKENS
  //await token.connect(user).approve(router.address, ethers.constants.MaxUint256)
  console.log('Tx ID: ', tx)
}

async function swapExactAVAXForTokens(
  token: Contract,
  router: Contract,
  user: SignerWithAddress,
  amount: string,
  slippage: number
) {
  console.log(
    `${colors.cyan('amount')}:   ${colors.green(
      formatEther(parseEther(amount))
    )}`
  )
  console.log(
    `${colors.cyan('slippage')}:  ${colors.green(slippage.toString())}`
  )

  const routerPath = [avalancheFujiTestnet.WAVAX, token.address]
  const amount_out: BigNumber = parseEther(amount)
  const amount_out_min: BigNumber[] = await router.getAmountsOut(
    amount_out,
    routerPath
  )
  const amount_out_min_tokens: BigNumber | undefined = amount_out_min[1]

  console.log(`${colors.cyan('routerPath')}:  ${routerPath}`)
  console.log(
    `${colors.cyan('amount_out')}:  ${colors.green(formatEther(amount_out))}`
  )
  console.log(
    `${colors.cyan('amount_out_min[0]')}:  ${colors.green(
      formatEther(amount_out_min[0])
    )}`
  )
  console.log(
    `${colors.cyan('amount_out_min[1]')}:   ${colors.green(
      formatEther(amount_out_min[1])
    )}`
  )
  console.log(
    `${colors.cyan('amount_out_min_tokens')}:  ${colors.green(
      formatEther(amount_out_min_tokens)
    )}`
  )

  const amountLessSlippage = Number(amount) - (Number(amount) * slippage) / 100
  console.log(
    `${colors.cyan('amountLessSlippage')}:  ${colors.green(
      amountLessSlippage.toString()
    )}`
  )

  await token.connect(user).approve(router.address, amount)
  const tx = await router.connect(user).swapExactAVAXForTokens(
    amount_out_min_tokens, // amountIn
    routerPath, //path
    user.address,
    2648069985, // Saturday, 29 November 2053 22:59:45
    {
      value: amount_out
    }
  )
  // APROVE MAX TOKENS
  //await token.connect(user).approve(router.address, ethers.constants.MaxUint256)
  console.log('Tx ID: ', tx.hash)
}

// async function diff(expected: any, actual: any) {
//   return Number((actual / formatEther(expected)) * 100 - 100)
// }

// async function diffInverse(expected: any, actual: any) {
//   return Number((formatEther(actual) / expected) * 100 - 100)
// }

// async function roundDiff(expected: any, actual: any) {
//   return Math.round((Math.abs(expected) / ((expected + actual) / 2)) * 100)
//   //return (actual / (expected * 100) - 100)
// }

async function forceImport(
  contractAddress: string,
  deployedImpl: any,
  opts: {
    kind?: 'uups' | 'transparent' | 'beacon'
  }
) {
  const contract = await upgrades.forceImport(
    contractAddress,
    deployedImpl,
    opts
  )

  return contract
}

function generateRandomAddresses(n: number): string[] {
  return new Array(n)
    .fill(0)
    .map(() => new Wallet(randomBytes(32).toString('hex')).address)
}

function generateRandomAmount(max: number): BigNumber {
  return parseEther(randomNumber(1, max).toString())
}

const randomNumber = (min: number, max: number) => {
  //Use below if final number doesn't need to be whole number
  //return Math.random() * (max - min) + min
  return Math.floor(Math.random() * (max - min) + min)
}

async function sleep(ms: number) {
  let command = 'sleep'
  if (os.platform() === 'linux') {
    command = 'sleep'
  }

  console.log()
  const s = ms / 1000
  console.log(command + ' ', s.toString(), ' seconds')
  await execShellCommand(command + ' ' + s.toString())
  console.log('awake')
  console.log()
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd: string) {
  const exec = require('child_process').exec
  return new Promise((resolve) => {
    exec(cmd, (error: ExecException, stdout: string, stderr: string) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

const avalancheFujiTestnet = {
  router: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
  factory: '0xE4A575550C2b460d2307b82dCd7aFe84AD1484dd',
  WAVAX: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c'
}

const tWallets = {
  lFee: '0xd235eD438FB2D6Bd428F5AEdF67bc8AB03bcFB96',
  bbFee: '0x09f33F64aAADf6A02956C9732b25d42DD9c2d4bC',
  rFee: '0x02FDE2D8e2E940d5D97FD8ad8F7a48dF8B6e3312'
}

export default module.exports = {
  avalancheFujiTestnet,
  tWallets,
  connectRouter,
  verifyToken,
  connectPair,
  connectFactory,
  deployProxy,
  verifyWithotDeploy,
  getProxyImplementation,
  generateRandomAddresses,
  deployProxyInitialize,
  swapExactTokensForAVAX,
  connectWAVAX: connectWAVAX,
  addLiquidityAVAX,
  generateRandomAmount,
  swapExactAVAXForTokens,
  swapExactTokensForAVAXSupportingFeeOnTransferTokens,
  deployProxyV2,
  forceImport,
  compareETHBalance,
  sleep
}
