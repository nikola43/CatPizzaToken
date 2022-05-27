import { ethers } from 'hardhat'

async function main(): Promise<string> {
    const [deployer] = await ethers.getSigners()
    if (deployer === undefined) throw new Error('Deployer is undefined.')

    const token = await ethers.getContractFactory('CatPizza')
    const tokenDeployed = await token.deploy()
    return tokenDeployed.address;
}

main()
    .then((r: string) => {
        console.log("Deployed Token Address " + r);
        console.log("run 'npx hardhat verify TokenAddress'" + r);
        console.log("example: " + r);
        return r;
    })
    .catch(error => {
        console.error(error)
        return undefined
    })