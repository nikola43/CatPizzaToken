#!/bin/bash
rm -rf cache
rm -rf bin
rm -rf artifacts
rm -rf cache


network="bsctestnet"
script="deployMidasTokenGenerator"
cmd="npx hardhat run --network $network scripts/$script.ts"


echo "$script"
echo "$network"
echo "$cmd"
executionResult=$($cmd)
echo "Contract Address: $executionResult"
exit

npx hardhat verify --network avaxfuji --constructor-args TokenConstructorArguments.js 0x864498Ca50FE13a57910663958fB1a77e1b5Cfc4


#cmd2="npx hardhat verify --network bsctestnet --constructor-args TokenConstructorArguments.js $executionResult"
#echo "$cmd2"
#executionResult2=$($cmd2)
#echo "$executionResult2"

#npx hardhat verify --network bsctestnet --constructor-args TokenConstructorArguments.js 0x0083Fd44346Abab9231163FFc6f71ee9F5d58406
