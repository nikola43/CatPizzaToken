#!/bin/bash
network="bsctestnet"
cmd="npx hardhat verify --network bsctestnet $1"

echo "$cmd"
echo "$($cmd)"