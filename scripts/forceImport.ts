// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers, upgrades } from 'hardhat'

import test_util from './util'
import util from './util'
let deployer: SignerWithAddress
let signers: SignerWithAddress[]

//available functions
async function main() {
  signers = await ethers.getSigners()
  deployer = signers[0]

  const tokenFactory = await ethers.getContractFactory('NodeManagerV10')
  const tokenImplementationAddress = await util.forceImport(
    '0x2Fcd73952e53aAd026c378F378812E5bb069eF6E',
    tokenFactory,
    { kind: 'transparent' }
  )
  console.log(tokenImplementationAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })