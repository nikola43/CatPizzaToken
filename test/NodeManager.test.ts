import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { getImplementationAddress } from '@openzeppelin/upgrades-core'
import { expect } from 'chai'
import { Contract } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { ethers, network } from 'hardhat'
import { describe } from 'mocha'

const colors = require('colors')

import test_util from '../scripts/util'

let deployer: SignerWithAddress
let reward: SignerWithAddress
let operations: SignerWithAddress
let signers: SignerWithAddress[]
let client1: SignerWithAddress
let client2: SignerWithAddress
let client3: SignerWithAddress
let client4: SignerWithAddress
let client5: SignerWithAddress
let pairContract: Contract
let routerFactory: Contract
let router: Contract
let tokenImplementationAddress: string
let wAvaxContract: Contract
const zeroAddress = '0x0000000000000000000000000000000000000000'
let nodeImplementationAddress: string
let nodeContract: Contract
let tokenContract: Contract
let lpPairContract: Contract

const timeoutDelay = 1000 * 60 * 300000
// @ts-ignore
const provider = ethers.provider
// const toTimestamp = (date: string) =>
//   date == undefined ? new Date().getTime() : new Date(date).getTime() / 1000
// const setBlockTime = async (date: string) => {
//   await network.provider.send('evm_setNextBlockTimestamp', [
//     date == undefined ? new Date().getTime() : new Date(date).getTime() / 1000
//   ])
//   await network.provider.send('evm_mine')
// }
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
describe('NodeManager contract', async () => {
  describe('Testing init requirements', () => {
    it('Get random wallets from #0 to #20 fo test', async () => {
      // GET SIGNERS
      signers = await ethers.getSigners()
      deployer = signers[0]
      reward = signers[1]
      operations = signers[2]
      client1 = signers[3]
      client2 = signers[4]
      client3 = signers[5]
      client4 = signers[6]
      client5 = signers[7]

      console.log(`Rewards Pool Address:  ${colors.yellow(reward.address)}`)
      console.log(
        `Operations Pool Address:  ${colors.yellow(operations.address)}\n`
      )

      console.log(`Deployer:  ${colors.yellow(client2.address)}`)
      console.log(`client 1 Address:  ${colors.yellow(client1.address)}`)
      console.log(`client 2 Address:  ${colors.yellow(client2.address)}`)
      console.log(`client 3 Address:  ${colors.yellow(client3.address)}`)
      console.log(`client 4 Address:  ${colors.yellow(client4.address)}`)
      console.log(`client 5 Address:  ${colors.yellow(client5.address)}\n`)

      console.log('LOAD CONTRACT')
      tokenContract = await ethers.getContractAt(
        'TokenV1',
        '0x343Cc4ea0548543AF23B9103013f4Af6dcAb0B1e'
      )
      tokenImplementationAddress = await getImplementationAddress(
        ethers.provider,
        tokenContract.address
      )
      expect(await tokenContract.balanceOf(deployer.address)).to.be.gt(
        parseEther('0')
      )
      console.log(
        `${colors.cyan('Token Address')}: ${colors.yellow(
          tokenContract.address
        )}`
      )
      console.log(
        `${colors.cyan('Implementation Address')}: ${colors.yellow(
          tokenImplementationAddress
        )}\n`
      )

      // GET BALANCES
      console.log(
        `Deployer Token Balance: ${formatEther(
          await tokenContract.balanceOf(deployer.address)
        )}`
      )
      console.log(
        `Deployer client 1 Balance : ${formatEther(
          await tokenContract.balanceOf(client1.address)
        )}`
      )
      console.log(
        `Deployer client 2 Balance: ${formatEther(
          await tokenContract.balanceOf(client2.address)
        )}`
      )
      console.log(
        `Deployer client 3 Balance: ${formatEther(
          await tokenContract.balanceOf(client3.address)
        )}`
      )
      console.log(
        `Deployer client 4 Balance: ${formatEther(
          await tokenContract.balanceOf(client4.address)
        )}`
      )
      console.log(
        `Deployer client 5 Balance: ${formatEther(
          await tokenContract.balanceOf(client5.address)
        )}\n`
      )

      console.log(
        `Rewards Pool Balance: ${formatEther(
          await tokenContract.balanceOf(reward.address)
        )}`
      )
      console.log(
        `Operations Pool Balance: ${formatEther(
          await tokenContract.balanceOf(operations.address)
        )}\n`
      )

      console.log()

      // INITIALIZE -----------------------------------------------------------------------------------------------------
      // INSTANCE ROUTER CONTRACT
      router = await test_util.connectRouter()
      wAvaxContract = await test_util.connectWAVAX()
      routerFactory = await test_util.connectFactory()

      // GET LP PAIR ADDRESS FROM TOKEN -> SHOULD BE DISTINCT 0x00000......0000
      lpPairAddress = await routerFactory.getPair(
        test_util.avalancheFujiTestnet.WAVAX,
        tokenContract.address
      )
      lpPairContract = await test_util.connectPair(await tokenContract.lpPair())
      const lpBalance = await lpPairContract.balanceOf(deployer.address)

      console.log(`WAVAX Address: ' ${wAvaxContract.address}`)
      console.log(`Router Address: ' ${router.address}`)
      console.log(`Router Factory: ' ${routerFactory.address}`)
      console.log(`LP Address: ' ${lpPairContract.address}`)
      console.log('Deployer LP tokens:', formatEther(lpBalance))


      console.log('Deploying...')
      const Node = 'NodeManagerV1'
      const args = [tokenContract.address, reward.address, operations.address]

      nodeContract = await test_util.deployProxy(Node, true, args)
      await delay(1000)
      nodeImplementationAddress = await getImplementationAddress(
          ethers.provider,
          nodeContract.address
      )
      await delay(1000)
      console.log(`NodeManager Address: ${nodeContract.address}`)
      console.log(`Implementation Address: ${nodeImplementationAddress}`)
      await nodeContract.transferOwnership(deployer.address)
      console.log()
      await delay(1000)
      //SET ROUTER ADDRESS
      await nodeContract.setRouter('0x2D99ABD9008Dc933ff5c0CD271B88309593aB921')
      const nodeRouterAddress = await nodeContract.uniswapV2Router()

      // ADD LIQUIDITY ----------------------------------------------------------------------------------------------------------------
      //await addLiquidity()
      //await tokenContract.setPairAddress(lpPairAddress)
      //expect(lpPairAddress).to.eq(await tokenContract.lpPair())

      // ------------------------------------------------------------------------------------------------------------------------------
    }).timeout(timeoutDelay)

    /*
    it('Deploying Token Contract', async () => {
      const contractName = 'TokenV1'
      tokenContract = await test_util.deployProxy(contractName)
      tokenImplementationAddress = await getImplementationAddress(
        ethers.provider,
        tokenContract.address
      )
      console.log(`Token Address: ${tokenContract.address}`)
      console.log(`Implementation Address: ${tokenImplementationAddress}`)
      await tokenContract.transferOwnership(deployer.address)
      console.log('')

      // GET BALANCES
      const deployerTokenBalance = await tokenContract.balanceOf(
        deployer.address
      )
      const bobTokenBalance = await tokenContract.balanceOf(client1.address)
      const aliceTokenBalance = await tokenContract.balanceOf(client2.address)
      console.log(
        `${colors.cyan('Deployer Token Balance')}: ${formatEther(
          deployerTokenBalance
        )}`
      )
      console.log(`Bob Token Balance: ${formatEther(bobTokenBalance)}`)
      console.log(`Alice Token Balance: ${formatEther(aliceTokenBalance)}\n`)
    }).timeout(timeoutDelay)
    */

    /*
    it('Initialize Token values', async () => {
      // INSTANCE ROUTER CONTRACT
      router = await test_util.connectRouter()
      wAvaxContract = await test_util.connectWAVAX()
      routerFactory = await test_util.connectFactory()

      // GET LP PAIR ADDRESS FROM TOKEN -> SHOULD BE DISTINCT 0x00000......0000
      lpPairAddress = await routerFactory.getPair(
          test_util.avalancheFujiTestnet.WAVAX,
          tokenContract.address
      )
      lpPairContract = await test_util.connectPair(await tokenContract.lpPair())
      let lpBalance = await lpPairContract.balanceOf(deployer.address)

      console.log(`WAVAX Address: ' ${wAvaxContract.address}`)
      console.log(`Router Address: ' ${router.address}`)
      console.log(`Router Factory: ' ${routerFactory.address}`)
      console.log(`LP Address: ' ${lpPairContract.address}`)
      console.log('Deployer LP tokens:', formatEther(lpBalance))

    }).timeout(timeoutDelay)

    */

    /*
    it('Add Liquidity Token', async () => {
      await addLiquidity()

      await tokenContract.setPairAddress(lpPairAddress)
      expect(lpPairAddress).to.eq(await tokenContract.lpPair())
    }).timeout(timeoutDelay)
    */
  })

  describe('Test NodeManager Contract', () => {
    it('Send tokens to wallets', async () => {
      await tokenContract.transfer(reward.address, parseEther('50000'))
      await delay(2000)
      await deployer.sendTransaction({
        to: reward.address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(2000)
      //expect(formatEther(sendTokenToRewards)).to.eq(parseEther('400000'))
      await tokenContract
        .connect(reward)
        .approve(nodeContract.address, parseEther('800000'))
      await delay(1000)
      // GET BALANCES
      const deployerTokenBalance = await tokenContract.balanceOf(
        deployer.address
      )
      const rewardTokenBalance = await tokenContract.balanceOf(reward.address)
      expect(
        parseInt(formatEther(rewardTokenBalance))
      ).to.be.greaterThanOrEqual(100000)

      await tokenContract.transfer(client1.address, parseEther('2000'))
      await delay(1000)
      await deployer.sendTransaction({
        to: client1.address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(1000)

      await tokenContract.transfer(client2.address, parseEther('1000'))
      await delay(1000)
      await deployer.sendTransaction({
        to: client2.address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(1000)

      await tokenContract.transfer(client5.address, parseEther('100'))
      await delay(1000)
      await deployer.sendTransaction({
        to: client5.address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(1000)

      await (
        await tokenContract.transfer(
          signers[8].address,
          '10000000000000000000000'
        )
      ).wait()
      await delay(1000)
      await deployer.sendTransaction({
        to: signers[8].address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(1000)
      expect(await tokenContract.balanceOf(signers[8].address)).to.equal(
        '10000000000000000000000'
      )
      await (
        await tokenContract.transfer(
          signers[9].address,
          '10000000000000000000000'
        )
      ).wait()
      await delay(1000)
      await deployer.sendTransaction({
        to: signers[9].address,
        value: parseEther('0.5') // Sends exactly 1.0 ether
      })
      await delay(1000)
      expect(await tokenContract.balanceOf(signers[9].address)).to.equal(
        '10000000000000000000000'
      )
    }).timeout(timeoutDelay)

    it('Approve tokens sended in wallets', async () => {
      await (
        await tokenContract
          .connect(signers[8])
          .approve(nodeContract.address, '10000000000000000000000')
      ).wait()
      await delay(1000)
      expect(
        await tokenContract.allowance(signers[8].address, nodeContract.address)
      ).to.equal('10000000000000000000000')
      await (
        await tokenContract
          .connect(signers[9])
          .approve(nodeContract.address, '10000000000000000000000')
      ).wait()
      await delay(1000)
      expect(
        await tokenContract.allowance(signers[9].address, nodeContract.address)
      ).to.equal('10000000000000000000000')
      await (
        await tokenContract
          .connect(client4)
          .approve(nodeContract.address, '10000000000000000000000')
      ).wait()
      await delay(1000)
      expect(
        await tokenContract.allowance(client4.address, nodeContract.address)
      ).to.equal('10000000000000000000000')
      await tokenContract
        .connect(client1)
        .approve(nodeContract.address, parseEther('5000'))
      await delay(1000)
      expect(
        await tokenContract.allowance(client1.address, nodeContract.address)
      ).to.equal(parseEther('5000'))
      await tokenContract
        .connect(client2)
        .approve(nodeContract.address, parseEther('5000'))
      await delay(1000)
      await tokenContract
        .connect(client5)
        .approve(nodeContract.address, parseEther('5000'))
      await delay(1000)
    }).timeout(timeoutDelay)
  })

  // describe('Nodes Creation batery test', () => {
  //   it('Create 5 basic nodes for #8 | Move in time to 08-04-2022', async () => {
  //     //await setBlockTime('2022-04-08')
  //     await (await nodeContract.connect(signers[8]).create('basic', 5)).wait()
  //     await delay(1000)
  //     totalNodesCreated += 5
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)
  //   it('Create 2 light nodes for #9', async () => {
  //     await (await nodeContract.connect(signers[8]).create('light', 2)).wait()
  //     await delay(1000)
  //     totalNodesCreated += 2
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //     expect(await nodeContract.countOfUser(signers[8].address)).to.equal(7)
  //   }).timeout(timeoutDelay)
  //   it('Create 3 basic nodes for #9', async () => {
  //     await (await nodeContract.connect(signers[9]).create('basic', 3)).wait()
  //     await delay(1000)
  //     totalNodesCreated += 3
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   })
  //   it('Count of total nodes by tiers', async () => {
  //     expect(await nodeContract.countOfUser(signers[9].address)).to.equal(3)
  //     expect(await nodeContract.countOfTier('basic')).to.equal(8)
  //     expect(await nodeContract.countOfTier('light')).to.equal(2)
  //   }).timeout(timeoutDelay)
  //   it('Get all nodes details of #8', async () => {
  //     const nodes = await nodeContract.nodes(signers[8].address)
  //     expect(nodes.length).to.equal(7)
  //   }).timeout(timeoutDelay)
  //   it('Get all nodes details of #9', async () => {
  //     const nodes = await nodeContract.nodes(signers[9].address)
  //     expect(nodes.length).to.equal(3)
  //   }).timeout(timeoutDelay)
  // })

  // describe('Test MASSIVE MINT gas price!!', () => {
  //   it('Mint 100 basic nodes from #10 to #20', async () => {
  //     for (let i = 10; i < 20; i++) {
  //       await nodeContract.mint([signers[i].address], 'basic', 100)
  //       await delay(1000)
  //       totalNodesCreated += 100
  //     }
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)
  // })

  // describe('Nodes Compound Test | Move in time to 12-05-2022', () => {
  //   it('Compound with 1 light node for #8', async () => {
  //     //await setBlockTime('2022-05-12')
  //     await (await nodeContract.connect(signers[8]).compound('light', 1)).wait()
  //     await delay(1000)
  //     totalNodesCreated += 1
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)

  //   it('Get all nodes details of #8', async () => {
  //     const nodes = await nodeContract.nodes(signers[8].address)
  //     expect(nodes.length).to.equal(8)
  //   }).timeout(timeoutDelay)

  //   it('Compound 1 basic tier node for #9', async () => {
  //     await (await nodeContract.connect(signers[9]).compound('basic', 1)).wait()
  //     await delay(1000)
  //     totalNodesCreated += 1
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)

  //   it('Get all nodes details of #9', async () => {
  //     const nodes = await nodeContract.nodes(signers[9].address)
  //     expect(nodes.length).to.equal(4)
  //   }).timeout(timeoutDelay)

  //   it('Get all rewards of #8', async () => {
  //     await nodeContract.rewardsOfUser(signers[8].address)
  //   }).timeout(timeoutDelay)

  //   it('Get all rewards of total wallets', async () => {
  //     await nodeContract.rewardsTotal()
  //   }).timeout(timeoutDelay)
  // })
  // describe('Claim Nodes Test | Move in time to 18-05-2022', () => {
  //   it('Claim for #8', async () => {
  //     //await setBlockTime('2022-05-18')
  //     await (await nodeContract.connect(signers[8]).claim()).wait()
  //     await delay(1000)
  //   }).timeout(timeoutDelay)

  //   it('Get all rewards of #8', async () => {
  //     await nodeContract.rewardsOfUser(signers[8].address)
  //     await tokenContract.balanceOf(signers[8].address)
  //   }).timeout(timeoutDelay)

  //   it('Get all rewards of total wallets', async () => {
  //     await nodeContract.rewardsTotal()
  //   }).timeout(timeoutDelay)
  // })

  // describe('Pay mantenance', () => {
  //   const limitTimes: number[] = []
  //   it('Pay mantenance and test value sended', async () => {
  //     // updagrade nodes
  //     const clientNodes = await nodeContract
  //       .connect(signers[9])
  //       .nodes(signers[9].address)
  //     const clientNodesId: number[] = []
  //     let amount = 0
  //     for (let i = 0; i < clientNodes.length; i++) {
  //       clientNodesId.push(clientNodes[i][0])
  //       const price: number =
  //         clientNodes[i][1] == 1 // check tierID 1 == Basic
  //           ? 0.0001
  //           : clientNodes[i][1] == 2 // check tierID 2 == Light
  //           ? 0.0005
  //           : 0.001 // tierID 3 == Pro
  //       amount += price
  //       limitTimes.push(clientNodes[i][5])
  //     }
  //     await nodeContract.connect(signers[9]).pay(1, clientNodesId, {
  //       value: parseEther(amount.toString())
  //     })
  //     await delay(1000)
  //   }).timeout(timeoutDelay)
  //   it('Test the increase of expiration time for payed nodes', async () => {
  //     const clientNodes = await nodeContract
  //       .connect(signers[9])
  //       .nodes(signers[9].address)
  //     const payInt = await nodeContract.payInterval()
  //     for (let i = 0; i < clientNodes.length; i++) {
  //       expect(limitTimes[i] + payInt).to.eq(clientNodes[i][5])
  //     }
  //   }).timeout(timeoutDelay)
  // })

  // describe('Test Requires (Security controls) and onlyOwner functions', () => {
  //   it('Try to create more than 100 nodes and expect the fail', async () => {
  //     await (await nodeContract.connect(client1).create('basic', 3)).wait()
  //     totalNodesCreated += 3
  //     await expect(
  //       nodeContract.connect(client1).create('basic', 100)
  //     ).to.be.revertedWith('Cannot create more nodes')
  //   }).timeout(timeoutDelay)

  //   it('Try to create 100 basic nodes without enough tokens', async () => {
  //     await expect(
  //       nodeContract.connect(client4).create('basic', 100)
  //     ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
  //   }).timeout(timeoutDelay)

  //   it('Try to create 50 light nodes without enough tokens', async () => {
  //     await expect(
  //       nodeContract.connect(client4).create('light', 50)
  //     ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
  //   }).timeout(timeoutDelay)

  //   it('Try to create 20 pro nodes without enough tokens', async () => {
  //     await expect(
  //       nodeContract.connect(client4).create('pro', 20)
  //     ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
  //   }).timeout(timeoutDelay)

  //   it('Try to burn another entire wallet', async () => {
  //     await expect(
  //       nodeContract.connect(client2).burnUser(client1.address)
  //     ).to.be.revertedWith('Ownable: caller is not the owner')
  //   }).timeout(timeoutDelay)

  //   it('Mint 100 basic nodes not being owner', async () => {
  //     await expect(
  //       nodeContract.connect(client2).mint([client5.address], 'basic', 100)
  //     ).to.be.revertedWith('Ownable: caller is not the owner')
  //   }).timeout(timeoutDelay)
  // })

  // describe('Nodes Upgrade Test', () => {
  //   it('Upgrade 1 node from basic tier to light tier for #8', async () => {
  //     await (
  //       await nodeContract.connect(signers[8]).upgrade('basic', 'light', 1)
  //     ).wait()
  //     await delay(1000)
  //     const basicTotalNodes = totalNodesCreated - 4
  //     expect(await nodeContract.countOfTier('basic')).to.equal(basicTotalNodes)
  //   }).timeout(timeoutDelay)

  //   it('Upgrade 1 node from basic tier to pro tier for #9', async () => {
  //     await (
  //       await nodeContract.connect(signers[8]).upgrade('basic', 'pro', 1)
  //     ).wait()
  //     await delay(1000)
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)
  //   it('Upgrade 1 node from basic tier to pro tier for #9', async () => {
  //     await expect(
  //       await nodeContract.connect(signers[8]).upgrade('pro', 'basic', 1)
  //     ).to.be.revertedWith('Unable to downgrade')
  //     await delay(1000)
  //   }).timeout(timeoutDelay)
  // })
  // describe('Node Transfer Test', () => {
  //   it('transfer basic 1 node from #8 to #9', async () => {
  //     await (
  //       await nodeContract.transfer(
  //         'basic',
  //         1,
  //         signers[8].address,
  //         signers[9].address
  //       )
  //     ).wait()
  //     await delay(1000)
  //     expect(await nodeContract.countOfUser(signers[8].address)).to.equal(7)
  //     expect(await nodeContract.countOfUser(signers[9].address)).to.equal(5)
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)
  // })

  // describe('Nodes Burn Test', () => {
  //   it('Burn for nodes #1,2,7 of wallets #8 and #9', async () => {
  //     await (await nodeContract.burnNodes([1, 2, 7])).wait()
  //     await delay(1000)
  //     //expect(await nodeContract.countOfUser(signers[8].address)).to.equal(5)
  //     // expect(await nodeContract.countOfUser(signers[9].address)).to.equal(4)

  //     // expect(await nodeContract.countOfTier('basic')).to.equal(4)
  //     totalNodesCreated -= 3
  //     expect(await nodeContract.countTotal()).to.equal(totalNodesCreated)
  //   }).timeout(timeoutDelay)

  //   it('Burn entire wallet #9 and check nodes', async () => {
  //     await (await nodeContract.burnUser(signers[9].address)).wait()
  //     await delay(1000)
  //     //expect(await nodeContract.countOfUser(signers[9].address)).to.equal(0)
  //     //const basicTotalNodes = totalNodesCreated - 10
  //     //expect(await nodeContract.countOfTier('basic')).to.equal(basicTotalNodes)
  //     //expect(await nodeContract.countTotal()).to.equal((totalNodesCreated -= 8))
  //   }).timeout(timeoutDelay)
  // })

  // describe('Check Unpaid Nodes Test!! | Moving time to 19-06-2022', () => {
  //   it('Most of the nodes gonna be burnned, be patient!!', async () => {
  //     //await setBlockTime('2022-06-19')
  //     const lastCount = await nodeContract.countTotal()
  //     console.log('First count of total nodes is: ', lastCount)
  //     await (await nodeContract.unpaidNodes()).wait()
  //     await delay(1000)
  //     //expect(await nodeContract.countTotal()).to.be.lt(lastCount)
  //     console.log(
  //       'Last count of total nodes is: ',
  //       await nodeContract.countTotal()
  //     )
  //   }).timeout(timeoutDelay)
  // })
})

async function addLiquidity() {
  // GET AVAX AND TOKEN BALANCE
  const avaxBalance = await deployer.getBalance()
  const tokenBalance = await tokenContract.balanceOf(deployer.address)

  await test_util.approveAndAddLiquidity(
    tokenContract,
    router,
    deployer,
    parseEther('100'),
    parseEther('100')
  )
  const lpBalance = await pairContract.balanceOf(deployer.address)
  expect(Number(formatEther(lpBalance))).to.be.gt(0)

  console.log(`Deployer Avax Balance:  ${formatEther(avaxBalance)}`)
  console.log(`Deployer Token Balance:  ${formatEther(tokenBalance)}`)
  console.log(`Deployer LP Token Balance:  ${formatEther(lpBalance)}\n`)
}
