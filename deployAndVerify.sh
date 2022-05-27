#!/bin/bash
# proxy version

echo "DEPLOY"
echo ""
rm -rf cache && rm -rf artifacts
CMD="npx hardhat run --network bsctestnet scripts/deployToken.ts"
echo "CMD: $CMD"
output=`eval $CMD`
echo "output: $output"



echo "VERIFY"
echo ""
CMD2="npx hardhat verify --network bsctestnet $output"
echo "CMD2: $CMD2"
output2=`eval $CMD2`
echo "output2: $output2"