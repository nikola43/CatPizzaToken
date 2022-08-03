// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaStockUtils {
    function getPathForTokensToTokens(
        address tokenAddressA,
        address tokenAddressB
    ) public pure returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = tokenAddressA;
        path[1] = tokenAddressB;
        return path;
    }

    function swapTokensForUSD(
        IUniswapV2Router02 dexRouter,
        address tokenAddress,
        address usd,
        uint256 tokenAmount
    ) public {
        address[] memory path = new address[](3);
        path[0] = tokenAddress;
        path[1] = dexRouter.WETH();
        path[2] = usd;

        // Do approve for router spend swap token amount
        IERC20(tokenAddress).approve(address(dexRouter), type(uint256).max);
        //IERC20(dexRouter.WETH()).approve(address(dexRouter), type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            tokenAddress,
            block.timestamp + 1000
        );
    }

    function swapUSDForTokens(
        IUniswapV2Router02 dexRouter,
        address tokenAddress,
        address usd,
        uint256 tokenAmount
    ) public {
        address[] memory path = new address[](3);
        path[0] = usd;
        path[1] = dexRouter.WETH();
        path[2] = tokenAddress;

        // Do approve for router spend swap token amount
        IERC20(tokenAddress).approve(address(dexRouter), type(uint256).max);
        //IERC20(dexRouter.WETH()).approve(address(dexRouter), type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            tokenAddress,
            block.timestamp + 1000
        );
    }

    function swapTokensForBNB(
        IUniswapV2Router02 dexRouter,
        address tokenAddress,
        uint256 tokenAmount
    ) public {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = tokenAddress;
        path[1] = dexRouter.WETH();

        IERC20(tokenAddress).approve(address(dexRouter), tokenAmount);

        //_approve(address(this), address(dexRouter), tokenAmount);

        // make the swap
        dexRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            tokenAddress,
            block.timestamp + 1000
        );
    }

    function sendToTeam(
        address tokenAddress,
        address[] memory wallets,
        uint256[] memory percentages
    ) public {
        uint256 masterTaxDivisor = 10000;
        uint256 usdBalance = IERC20(tokenAddress).balanceOf(tokenAddress);

        for (uint256 index = 0; index < wallets.length; index++) {
            IERC20(tokenAddress).transfer(
                wallets[index],
                (usdBalance * percentages[index]) / masterTaxDivisor
            );
        }
    }

    function addLiquidity(
        IUniswapV2Router02 dexRouter,
        address tokenAddress,
        uint256 tokenAmount,
        uint256 ethAmount,
        address lpReceiver
    ) public {
        // approve token transfer to cover all possible scenarios
        IERC20(tokenAddress).approve(address(dexRouter), type(uint256).max);

        //_approve(self(), address(dexRouter), type(uint256).max);

        // add the liquidity
        dexRouter.addLiquidityETH{value: ethAmount}(
            tokenAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            lpReceiver, // send lp tokens to owner
            block.timestamp + 10000
        );
    }

    function autoLiquidity(
        IUniswapV2Router02 dexRouter,
        address tokenAddress,
        uint256 tokenAmount,
        address lpReceiver
    ) public {
        // split the contract balance into halves
        uint256 half = tokenAmount / 2;

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = tokenAddress.balance;

        // swap tokens for ETH
        swapTokensForBNB(dexRouter, tokenAddress, half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = tokenAddress.balance - initialBalance;

        // add liquidity to uniswap
        addLiquidity(dexRouter, tokenAddress, half, newBalance, lpReceiver);
    }
}
