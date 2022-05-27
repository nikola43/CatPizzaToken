import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";
import { expect } from "chai";
import { Contract } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { describe } from "mocha";

const colors = require("colors");

import test_util from "../scripts/util";

let deployer: SignerWithAddress | undefined;
let reward: SignerWithAddress | undefined;
let operations: SignerWithAddress | undefined;
let signers: SignerWithAddress[];
let client1: SignerWithAddress | undefined;
let client2: SignerWithAddress | undefined;
let client3: SignerWithAddress | undefined;
let client4: SignerWithAddress | undefined;
let client5: SignerWithAddress | undefined;
let midas: Contract;
let midasImplementationAddress: string;

const timeoutDelay = 1000 * 60 * 300000;
// @ts-ignore
const provider = ethers.provider;

describe("Midas Testing", async () => {
  it("Get random wallets from #0 to #20 fo test", async () => {
    // GET SIGNERS
    signers = await ethers.getSigners();
    deployer = signers[0];
    reward = signers[1];
    operations = signers[2];
    client1 = signers[3];
    client2 = signers[4];
    client3 = signers[5];
    client4 = signers[6];
    client5 = signers[7];

    console.log(`Deployer:  ${colors.yellow(client2?.address)}`);
    console.log(`client 1 Address:  ${colors.yellow(client1?.address)}`);
    console.log(`client 2 Address:  ${colors.yellow(client2?.address)}`);
    console.log(`client 3 Address:  ${colors.yellow(client3?.address)}`);
    console.log(`client 4 Address:  ${colors.yellow(client4?.address)}`);
    console.log(`client 5 Address:  ${colors.yellow(client5?.address)}\n`);
  }).timeout(timeoutDelay);

  it("create token", async () => {
    console.log("Deploying...");

    const midasName = "MidasTokenGenerator";
    
    const args = [
      "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
      "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
      "0x6EFF4835385b8D683431290356eE668193D18Efe",
      "0xd235eD438FB2D6Bd428F5AEdF67bc8AB03bcFB96",
      "0x09f33F64aAADf6A02956C9732b25d42DD9c2d4bC",
      "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
    ];

    midas = await test_util.deployProxy(midasName, true, args);
    await test_util.sleep(1000);
    midasImplementationAddress = await getImplementationAddress(
      ethers.provider,
      midas.address
    );
    await test_util.sleep(1000);
    console.log(`NodeManager Address: ${midas.address}`);
    console.log(`Implementation Address: ${midasImplementationAddress}`);

    console.log(`midas Address:  ${colors.yellow(midas?.address)}`);

    expect(true);
  }).timeout(timeoutDelay);
  it("Set token values", async () => {
    await midas.updateBusdAddress('0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7');
    await test_util.sleep(1000);
  }).timeout(timeoutDelay);
});
