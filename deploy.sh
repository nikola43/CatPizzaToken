#!/bin/bash
rm -rf cache
rm -rf bin
rm -rf artifacts
rm -rf cache

network="bsctestnet"
script="deployTestToken"
cmd="npx hardhat run --network $network scripts/$script.ts"

echo "$($cmd)"
