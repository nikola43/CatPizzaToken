import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter"
import "@openzeppelin/hardhat-upgrades";


const mnemonic = "d4e91ac43134265cc9d905e04be7db37329dc2dddcf69bbdeef5543dc05c0651"

/*
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts: [`${mnemonic}`]", "Prints the list of accounts: [`${mnemonic}`]", async () => {
  const accounts: [`${mnemonic}`] = await ethers.getSigners();

  for (const account of accounts: [`${mnemonic}`]) {
    console.log(account.address);
  }
});
*/

/*

npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
*/

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "avaxfuji",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {},
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 20000000000,
      gasMultiplier: 2,
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      accounts: [`${mnemonic}`],
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gas: 5198000,
      gasMultiplier: 2,
    },
    arbitrum: {
      url: "https://kovan3.arbitrum.io/rpc",
      accounts: [`${mnemonic}`],
      chainId: 79377087078960,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts: [`${mnemonic}`],
      chainId: 250,
      live: true,
      saveDeployments: true,
      gasPrice: 22000000000,
    },
    "fantom-testnet": {
      url: "https://rpc.testnet.fantom.network",
      accounts: [`${mnemonic}`],
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [`${mnemonic}`],
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [`${mnemonic}`],
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    xdai: {
      url: "https://rpc.xdaichain.com",
      accounts: [`${mnemonic}`],
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts: [`${mnemonic}`],
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      accounts: [`${mnemonic}`],
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      //gasMultiplier: 2,
    },
    heco: {
      url: "https://http-mainnet.hecochain.com",
      accounts: [`${mnemonic}`],
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    "heco-testnet": {
      url: "https://http-testnet.hecochain.com",
      accounts: [`${mnemonic}`],
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [`${mnemonic}`],
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 225000000000,
    },
    avaxfuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`${mnemonic}`],
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    harmony: {
      url: "https://api.s0.t.hmny.io",
      accounts: [`${mnemonic}`],
      chainId: 1666600000,
      live: true,
      saveDeployments: true,
    },
    "harmony-testnet": {
      url: "https://api.s0.b.hmny.io",
      accounts: [`${mnemonic}`],
      chainId: 1666700000,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
  },
  etherscan: {
    apiKey: "UMKZDMNWZE1PTPD4JVUUUXN7WGNR1FWZJW" // bsc
    //apiKey: "ZGR21YGDGQSIVXI5B2NR5K73MFCDI4QPH8" // avax fuju
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 25,
    // enabled: process.env.REPORT_GAS ? true : false,
  },
};
