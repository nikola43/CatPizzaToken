import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'

dotenv.config()

//import "./scripts/task/tasks";

const mnemonic =
  process.env.PKY_KEY ||
  '1f373d593b7ea77320b1d95cf6991058053f5421fad9db932160133b63f4f01e'

const mnemonicBob =
  process.env.PKY_KEY ||
  'fe2d7880e7f6236be3518defe10d83f2969b48a47f0ff796fd481bde5bcd5a21'

const mnemonicAlice =
  process.env.PKY_KEY ||
  'bf60370ceb06c7f76055e96e9417f9dca3a677007ea6045c187a98bd71ceee62'

const mnemonic1 =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const mnemonic2 =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

const mnemonic3 =
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

const mnemonic4 =
  '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6'

const mnemonic5 =
  '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a'

const mnemonic6 =
  '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba'

const mnemonic7 =
  '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e'

const mnemonic8 =
  '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356'

const mnemonic9 =
  '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97'

const mnemonic10 =
  '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6'

const mnemonic11 =
  '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897'

const mnemonic12 =
  '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82'

const mnemonic13 =
  '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1'

const mnemonic14 =
  '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd'

const mnemonic15 =
  '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa'

const mnemonic16 =
  '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61'

const mnemonic17 =
  '0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0'

const mnemonic18 =
  '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'

const mnemonic19 =
  '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0'

const mnemonic20 =
  '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {},
    /*
    localhost: {
      forking: {
        url: 'https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/bsc/testnet/archive',
      },
      gas: 6721975,
    },
    hardhat: {
      forking: {
        url: 'https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/bsc/testnet/archive',
        blockNumber: 18513368
      },
      blockGasLimit: 500000000
    },
    */
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      gasPrice: 120 * 1000000000,
      chainId: 1
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 3,
      gasPrice: 5000000000,
      gasMultiplier: 2
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 4,
      gasPrice: 5000000000,
      gasMultiplier: 2
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 5,
      gasPrice: 5000000000,
      gasMultiplier: 2
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${mnemonic}`],
      chainId: 42,
      gasPrice: 20000000000,
      gasMultiplier: 2
    },
    moonbase: {
      url: 'https://rpc.testnet.moonbeam.network',
      accounts: [`${mnemonic}`],
      chainId: 1287,
      gas: 5198000,
      gasMultiplier: 2
    },
    arbitrum: {
      url: 'https://kovan3.arbitrum.io/rpc',
      accounts: [`${mnemonic}`],
      chainId: 79377087078960,
      gasMultiplier: 2
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      accounts: [`${mnemonic}`],
      chainId: 250,
      gasPrice: 22000000000
    },
    'fantom-testnet': {
      url: 'https://rpc.testnet.fantom.network',
      accounts: [`${mnemonic}`],
      chainId: 4002,
      gasMultiplier: 2
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com',
      accounts: [`${mnemonic}`],
      chainId: 137,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [`${mnemonic}`],
      chainId: 80001,
      gasMultiplier: 2
    },
    xdai: {
      url: 'https://rpc.xdaichain.com',
      accounts: [`${mnemonic}`],
      chainId: 100,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts: [`${mnemonic}`],
      chainId: 56,
    },
    bsctestnet: {
      url: 'https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/bsc/testnet/archive',
      accounts: [
        `${mnemonic}`,
        mnemonicBob,
        mnemonicAlice,
        mnemonic1,
        mnemonic2,
        mnemonic3,
        mnemonic4,
        mnemonic5,
        mnemonic6,
        mnemonic7,
        mnemonic8,
        mnemonic9,
        mnemonic10,
        mnemonic11,
        mnemonic12,
        mnemonic13,
        mnemonic14,
        mnemonic15,
        mnemonic16,
        mnemonic17,
        mnemonic18,
        mnemonic19,
        mnemonic20
      ],
      chainId: 97,
      gasMultiplier: 2
    },
    heco: {
      url: 'https://http-mainnet.hecochain.com',
      accounts: [`${mnemonic}`],
      chainId: 128,
    },
    'heco-testnet': {
      url: 'https://http-testnet.hecochain.com',
      accounts: [`${mnemonic}`],
      chainId: 256,
      gasMultiplier: 2
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [`${mnemonic}`],
      chainId: 43114,
      gasPrice: 225000000000
    },
    avaxfuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [`${mnemonic}`],
      chainId: 43113,
      gasMultiplier: 2
    },
    harmony: {
      url: 'https://api.s0.t.hmny.io',
      accounts: [`${mnemonic}`],
      chainId: 1666600000,
    },
    'harmony-testnet': {
      url: 'https://api.s0.b.hmny.io',
      accounts: [`${mnemonic}`],
      chainId: 1666700000,
      gasMultiplier: 2
    }
  },
  etherscan: {
    //apiKey: 'ZGR21YGDGQSIVXI5B2NR5K73MFCDI4QPH8' // avax
    apiKey: "V28HJCGUP2XCHSV5IXXG6IK9W14HHXKDCY" // bsc
  },
  solidity: {
    compilers: [
      {
        version: '0.8.14',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
      {
        version: '0.6.12', // Pancake Router
        settings: {
          optimizer: {
            enabled: true
          }
        }
      },
      {
        version: '0.6.6', // Pangolin Router
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          }
        }
      },
      {
        version: '0.8.2' // Pancake Pair
      },
      {
        version: '0.5.17' // WAVAX
      },
      {
        version: '0.5.16' // Pancake / Pangolin -> Pair / Factory
      },
      {
        version: '0.5.0' // Pancake Pair
      },
      {
        version: '0.4.18' // WBNB
      }
    ]
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 6000000
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5'
  },
  gasReporter: {
    token: "BNB",
    currency: 'USD',
    gasPrice: 5,
    enabled: false,
    coinmarketcap: '0caa3779-3cb2-4665-a7d3-652823b53908'
  }
}

export default config