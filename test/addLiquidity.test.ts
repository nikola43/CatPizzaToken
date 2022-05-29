import { ethers } from 'hardhat'
const util = require('./util');
const { parseEther } = ethers.utils;
const colors = require('colors');
import { expect } from 'chai'
import { formatEther } from 'ethers/lib/utils';

//available functions
describe("Token contract", async () => {

    it("Add Liquidity", async () => {

        // Get Signers
        const [deployer, bob] = await ethers.getSigners()
        console.log(`${colors.cyan('Deployer Address')}: ${colors.yellow(deployer?.address)}`)
        console.log(`${colors.cyan('Bob Address')}: ${colors.yellow(bob?.address)}`)


        // INSTANCE CONTRACT
        const router = await util.connectRouter()
        //const routerFactory = await util.connectFactory()
        //const bnbContract = await util.connectWBNB()
        //const busdContract = await util.connectBUSD()

        // DEPLOY
        const contractName = 'CatPizza'
        const tokenFactory = await ethers.getContractFactory(contractName)
        const tokenDeployed = await tokenFactory.deploy()
        await tokenDeployed.deployed()

        await tokenDeployed.approve(router.address, ethers.constants.MaxUint256);
        //await util.approveAndAddLiquidity(tokenDeployed, router, deployer, parseEther("30"), parseEther("100000"));


        await tokenDeployed.approve(util.chains.bsc.router, ethers.constants.MaxUint256, { from: deployer?.address })
        const tx = await router.connect(deployer).addLiquidityETH(
            tokenDeployed.address,
            parseEther("60000000"),
            parseEther("60000000"),
            parseEther("100"),
            deployer?.address,
            2648069985, // Saturday, 29 November 2053 22:59:45
            {
                value: parseEther("100"),
            }
        )
        console.log(`${colors.cyan('TX')}: ${colors.yellow(tx.hash)}`)

        const routerFactory = await util.connectFactory();
        const pairAddress = await routerFactory.getPair(util.chains.bsc.wChainCoin, tokenDeployed.address)
        const pairContract = await util.connectPair(pairAddress);
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);

        //--- BUY
        await util.swapExactETHForTokens(tokenDeployed.address, router, bob, parseEther("1.6"));
        console.log(`${colors.cyan('Bob token Balance')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)

        //await util.swapExactETHForTokens(tokenDeployed.address, router, bob, parseEther("0.2"));
        console.log(`${colors.cyan('Bob token Balance')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)


        //--- SELL
        await tokenDeployed.approve(router.address, ethers.constants.MaxUint256);
        //await util.swapExactTokensForETH(tokenDeployed.address, router, bob, parseEther("1000")); // 100 tokens
        //console.log(`${colors.cyan('Bob token Balance')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)
    });

    /*
    it("Bob should approve max allowance", async () => {
        await busdContract.connect(bob).approve(router.address, ethers.constants.MaxUint256);
    });
    

    it("Should send BUSD to BOB", async () => {
        await busdContract.connect(deployer).transfer(bob?.address, parseEther("500"));
        let balance = await busdContract.balanceOf(bob?.address);
        expect(balance).to.be.equal(parseEther("500"));
    });

    it("Bob should swap BNB for BUSD", async () => {
        await util.swapApproveBNBtoBUSD(busdContract, router, bob, parseEther("100"))
        let balance = await busdContract.balanceOf(bob?.address);
        expect(balance).to.be.above(parseEther("488"));
    });
    */

    /*
    it("Bob should buy LFG with BUSD", async () => {
        await util.buyLFG(busdContract, tokenDeployed, router, bob, parseEther("1"));
    });
    */


});