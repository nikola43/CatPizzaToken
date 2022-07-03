#!/bin/bash
network="bsctestnet"
script="addLiquidity"
cmd="npx hardhat test tests/$script.test.ts --network $network"

echo "$($cmd)"
