import { ethers } from 'hardhat'
const util = require('./util');
const { parseEther } = ethers.utils;
const colors = require('colors');
import { expect } from 'chai'
import { formatEther } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

//available functions
describe("Token contract", async () => {

    let tokenDeployed: Contract;
    let busdContract: Contract;
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
    });

    it("2. Deploy Contract", async () => {

        // INSTANCE CONTRACT
        router = await util.connectRouter()
        //const routerFactory = await util.connectFactory()
        //const bnbContract = await util.connectWBNB()
        busdContract = await util.connectBUSD()

        // DEPLOY
        const contractName = 'MetaStock'
        const tokenFactory = await ethers.getContractFactory(contractName)
        tokenDeployed = await tokenFactory.deploy()
        await tokenDeployed.deployed()

    });

    it("3. Add Liquidity", async () => {
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
        console.log()

        const routerFactory = await util.connectFactory();
        const pairAddress = await routerFactory.getPair(util.chains.bsc.wChainCoin, tokenDeployed.address)
        pairContract = await util.connectPair(pairAddress);
        console.log(`${colors.cyan('LP Address')}: ${colors.yellow(pairContract?.address)}`)
        console.log(`${colors.cyan('LP Balance')}: ${colors.yellow(formatEther(await pairContract.balanceOf(deployer?.address)))}`)
        expect(1).to.be.eq(1);
        console.log()
    });

    it("4. Enable trading", async () => {
        await tokenDeployed.enableTrading();
        console.log()
    });

    it("5. Transfer From Owner To Bob ",async () => {
        await tokenDeployed.transfer(bob.address, parseEther("1000"))
        expect(await tokenDeployed.balanceOf(bob?.address)).to.be.eq(parseEther("1000"));
        console.log()
    });

    it("6. Transfer From Bob To Alice ", async () => {
        await tokenDeployed.connect(bob).transfer(alice?.address, parseEther("100"))
        expect(await tokenDeployed.balanceOf(alice?.address)).to.be.eq(parseEther("100"));
        console.log()
    });

    it("7. Transfer From Deployer To Token", async () => {
        await tokenDeployed.connect(deployer).transfer(tokenDeployed.address, parseEther("1001000"))
        console.log(`${colors.cyan('Contract token Balance After')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log()
    });

    it("8. Buy Bob", async () => {

        console.log()
        //--- BUY
        console.log(`${colors.cyan('Contract token Balance Before Swap')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        await util.swapExactETHForTokens(tokenDeployed.address, router, bob, parseEther("1.2"));
        console.log(`${colors.cyan('Bob token Balance After Swap')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)
        console.log(`${colors.cyan('Contract token Balance After')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log()
    });

    it("9. Check transfered tokens to team before", async () => {
        console.log(`${colors.cyan('W1 busd Balance before')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4')))}`)
        console.log()
        console.log(`${colors.cyan('W2 busd Balance before')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')))}`)
        console.log()
        console.log(`${colors.cyan('W3 busd Balance before')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x90F79bf6EB2c4f870365E785982E1f101E93b906')))}`)
        console.log()
        console.log(`${colors.cyan('W4 busd Balance before')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8')))}`)
        console.log()
        console.log(`${colors.cyan('W5 busd Balance before')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x4CF4525Ea8225ef715236538a3D7F06151BfEe11')))}`)
        console.log()
        console.log(`${colors.cyan('Charity token Balance before')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf('0x492A9CE7f973958454fcBcae0E22985e15cdBE58')))}`)
        console.log()
    });

    it("10. Sell Bob", async () => {
        //--- SELL
        //await util.swapExactTokensForETH(tokenDeployed.address, router, bob, parseEther("1000")); // 100 tokens
        
        await tokenDeployed.connect(bob).approve(router.address, parseEther("100"))
        await util.swapExactTokensForTokensSupportingFeeOnTransferTokens(tokenDeployed.address, router, bob, parseEther("100")); // 100 tokens
        console.log(`${colors.cyan('Bob token Balance')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(bob?.address)))}`)
        console.log(`${colors.cyan('Contract token Balance After')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf(tokenDeployed.address)))}`)
        console.log()
    });

    it("11. Check transfered tokens to team after", async () => {
        console.log(`${colors.cyan('W1 busd Balance after')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4')))}`)
        console.log()
        console.log(`${colors.cyan('W2 busd Balance after')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')))}`)
        console.log()
        console.log(`${colors.cyan('W3 busd Balance after')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x90F79bf6EB2c4f870365E785982E1f101E93b906')))}`)
        console.log()
        console.log(`${colors.cyan('W4 busd Balance after')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8')))}`)
        console.log()
        console.log(`${colors.cyan('W5 busd Balance after')}: ${colors.yellow(formatEther(await busdContract.balanceOf('0x4CF4525Ea8225ef715236538a3D7F06151BfEe11')))}`)
        console.log()
        console.log(`${colors.cyan('Charity token Balance after')}: ${colors.yellow(formatEther(await tokenDeployed.balanceOf('0x492A9CE7f973958454fcBcae0E22985e15cdBE58')))}`)
        console.log()
    });
});