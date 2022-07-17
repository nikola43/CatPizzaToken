import { ethers } from 'hardhat'
const util = require('./util');
const { parseEther } = ethers.utils;
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

    it("5. Transfer From Owner To Bob ", async () => {

        await tokenDeployed.transfer(bob.address, parseEther("1000"))
        console.log(`${colors.cyan('Bob token Balance')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)

        expect(1).to.be.eq(1);
        console.log()
    });

    it("1. Buy Bob", async () => {

        console.log()
        //--- BUY
        console.log(`${colors.cyan('Contract token Balance Before Swap')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        await util.swapExactETHForTokens(tokenDeployed.address, router, bob, parseEther("0.5"));
        console.log(`${colors.cyan('Bob token Balance After Swap')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)
        console.log(`${colors.cyan('Contract token Balance After')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        expect(1).to.be.eq(1);
        console.log()
    });
});