# Hardhat Typescript Template

Create and test smart contracts using Hardhat with Typescript.


npx hardhat node --fork https://api.avax-test.network/ext/bc/C/rpc

npx hardhat test  --network localhost

Uses

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript types for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

## Get Started

Before running any command, make sure to install dependencies:

```sh
npm install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
npm run compile
```

### Test

Run the Mocha tests:

```sh
npm run test
```

### Deploy contract to netowrk (requires private key and Alchemy API key)

```sh
npx hardhat run --network ropsten ./scripts/deploy.ts
```

### Validate a contract with etherscan (requires API key)

```sh
npx hardhat verify --network <network> <DEPLOYED_CONTRACT_ADDRESS> "Constructor argument 1"
```

## Plugins

- Gas reporter [hardhat-gas-reporter](https://hardhat.org/plugins/hardhat-gas-reporter.html)
- Etherscan [hardhat-etherscan](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)

## Issues

- [Solidity linter [solc] compiler version on VSCode](https://ethereum.stackexchange.com/questions/46158/solved-how-to-change-solidity-linter-solc-compiler-version-in-visual-studio-c)
- [Solhint compiler-version issue](https://github.com/protofire/solhint/issues/230)

## References

- [amanusk/hardhat-template](https://github.com/amanusk/hardhat-template)
- [Hardhat Tutorial](https://hardhat.org/tutorial/)
# lfg_upgradable_token
# tokenVesting

Keepers
CronusTimeKeeper Proxy Address: 0x74b13cCa8e7c1320201A9486b907267d8e1559c3
CronusTimeKeeper Implementation Address: 0xfd6C6435b4774C44A3e4a0D5c5961597205C4077

DataFeeds
MidasGoldOracle Proxy Address:  0xB779ed2686d1f6E9F9d9D9E65F87c7B7910F06D5
MidasGoldOracle Implementation Address:  0x66E4AeCa6e06C19ca6701Ec525f874A708337d8f

Util
TykheFortuneDistributor Proxy Address: 0xeD60d0aD516e1905A7f69E62B563fAD202d3Fc38
TykheFortuneDistributor Implementation Address: 0xe8e0B311176B90CdDb9F64573efF5379b3807D79

VRF
TykheLuckyOracle Proxy Address:  0x9F51030f44BB5C27E2a035D29c0459171fcB67cB
TykheLuckyOracle Implementation Address:  0x5114E8BA03e8D25b2ba45570aFA7C600E2d9b759



1.
npx hardhat run scripts/fuji/TykheFortuneDistributor.ts --network avaxfuji

(Añadido deploy de CronusTimeKeeper en este paso).

2.
npx hardhat run scripts/fuji/TykheLuckyOracle.ts --network avaxfuji

*Cada red cuenta con su directorio concreto con los parámetros de dicha red ya configurados.


npx hardhat verify --network bsctestnet  --constructor-args libraries.js 0x8afDd22D1F67aDa01c452375882c8D25B030bFB4