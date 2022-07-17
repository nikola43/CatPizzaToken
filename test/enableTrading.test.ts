import { ethers } from 'hardhat'
const util = require('./util');
const colors = require('colors');
import { expect } from 'chai'
import { formatEther } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import hre from 'hardhat'
//available functions
describe("Token contract", async () => {

    let tokenDeployed: Contract;
    let router: Contract;
    let pairContract: Contract;
    let deployer: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;

    it("1. Get Signer", async () => {
        const signers = await ethers.getSigners();
        if (signers[0] !== undefined) {
            deployer = signers[0];
            console.log(`${colors.cyan('Deployer Address')}: ${colors.yellow(deployer?.address)}`)
        }
        if (signers[1] !== undefined) {
            bob = signers[1];
            console.log(`${colors.cyan('Bob Address')}: ${colors.yellow(bob?.address)}`)
        }
        if (signers[2] !== undefined) {
            alice = signers[2];
            console.log(`${colors.cyan('Alice Address')}: ${colors.yellow(alice?.address)}`)
        }



        const networkName = hre.network.name
        const chainId = hre.network.config.chainId

        console.log(`${colors.cyan('networkName')}: ${colors.yellow(networkName)}`)
        console.log(`${colors.cyan('chainId')}: ${colors.yellow(chainId)}`)
    });

    it("2. LOAD Contract", async () => {

        // INSTANCE CONTRACT
        router = await util.connectRouter()
        console.log(`${colors.cyan('router')}: ${colors.yellow(router.address)}`)

        // DEPLOY
        const contractName = 'CatPizza'
        tokenDeployed = await ethers.getContractAt(contractName, '0x680208EDE22B1fBF5840CAEFFD965877ff2c25Df')

        const routerFactory = await util.connectFactory();
        const pairAddress = await routerFactory.getPair(util.chains.bsc.wChainCoin, tokenDeployed.address)
        pairContract = await util.connectPair(pairAddress);
        console.log(`${colors.cyan('Token Address')}: ${colors.yellow(tokenDeployed?.address)}`)
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);
    });

    it("4. Enable trading", async () => {
        await tokenDeployed.enableTrading();
        console.log()
    });
});