#!/bin/bash
network="bsctestnet"
script="buy"
cmd="npx hardhat test tests/$script.test.ts --network $network"

echo "$($cmd)"
