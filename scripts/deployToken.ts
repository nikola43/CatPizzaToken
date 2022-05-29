import { ethers } from 'hardhat'
import { ExecException } from 'child_process'
const colors = require('colors/safe');
async function main(): Promise<string> {
    const [deployer] = await ethers.getSigners()
    if (deployer === undefined) throw new Error('Deployer is undefined.')
    console.log(colors.cyan('Deployer Address: ') + colors.yellow(deployer.address));
    console.log();
    console.log(colors.yellow('Deploying...'));
    console.log();
    const token = await ethers.getContractFactory('CatPizza')
    const tokenDeployed = await token.deploy()
    return tokenDeployed.address;
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

main()
    .then(async (r: string) => {
        console.log("");
        console.log(colors.green('Deploy Successfully!'));
        console.log(colors.cyan('Deployed Token Address: ') + colors.yellow(r));
        console.log("");
        await execShellCommand("sleep 5");
        const command = "npx hardhat verify " + r;
        console.log(colors.cyan('Run: '));
        console.log("");
        console.log(colors.yellow(command));
        console.log("");
        console.log(colors.cyan("For ") + colors.green("verify") + colors.cyan(" your contract"));
        return r;
    })
    .catch(error => {
        console.error(error);
        return undefined;
    })