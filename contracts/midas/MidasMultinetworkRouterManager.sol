// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IMidasMultiNetworkRouter.sol";
import "./ChainlinkDataFeedsManager.sol";

contract MidasMultinetworkRouterManager {
    IMidasMultiNetworkRouter private dexRouter; // router instance for do swaps
    address private stableCoin;
    bool private inSwap; // used for dont take fee on swaps
    uint256 private networkId;

    ChainlinkDataFeedsManager chainlinkDataFeedsManager;

    modifier swapping() {
        inSwap = true;
        _;
        inSwap = false;
    }

    constructor(
        address _dexRouterAddress,
        address _chainlinkDataFeedsManagerAddress
    ) {
        dexRouter = IMidasMultiNetworkRouter(_dexRouterAddress);
        networkId = 97;
        stableCoin = address(0);
        chainlinkDataFeedsManager = new ChainlinkDataFeedsManager(
            _chainlinkDataFeedsManagerAddress
        );
    }

    function getDexRouter() external view returns (IMidasMultiNetworkRouter) {
        return dexRouter;
    }

    function setDexRouter(address _dexRouterAddress) external {
        dexRouter = IMidasMultiNetworkRouter(_dexRouterAddress);
    }

    function isInSwap() external view returns (bool) {
        return inSwap;
    }

    function setChainlinkDataFeedsManager(
        address _chainlinkDataFeedsManagerAddress
    ) external virtual {
        chainlinkDataFeedsManager = new ChainlinkDataFeedsManager(
            _chainlinkDataFeedsManagerAddress
        );
    }

    function getStableCoinAddress(uint256 _networkId)
        public
        pure
        returns (address)
    {
        address networkTokenAddress = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7;
        if (_networkId == 97) {
            networkTokenAddress = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7;
        } else if (_networkId == 97) {
            networkTokenAddress = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7;
        } else {
            revert("unsupported network");
        }

        return networkTokenAddress;
    }

    function getNativeTokenAddress(uint256 _networkId)
        public
        pure
        returns (address)
    {
        address networkTokenAddress = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
        if (_networkId == 97) {
            networkTokenAddress = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
        } else if (_networkId == 97) {
            networkTokenAddress = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
        } else {
            revert("unsupported network");
        }

        return networkTokenAddress;
    }

    function getDexRouterAddress() external view returns (address) {
        return address(dexRouter);
    }

    function swapTokensForStableCoin(
        address tokenAddress,
        address to,
        uint256 amount
    ) external {
        address[] memory path = new address[](3);
        path[0] = tokenAddress;
        path[1] = getNativeTokenAddress(networkId);
        path[2] = stableCoin;

        // Do approve for router spend swap token amount
        IERC20(stableCoin).approve(address(dexRouter), type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amount,
            0,
            path,
            to,
            block.timestamp + 1000
        );
    }

    function swapTokensForNativeToken(
        address token,
        address to,
        uint256 amount
    ) external {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = getNativeTokenAddress(networkId);

        IERC20(token).approve(address(dexRouter), type(uint256).max);

        // make the swap
        dexRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amount,
            0, // accept any amount of ETH
            path,
            to,
            block.timestamp
        );
    }

    /// @notice return the route given the busd addresses and the token
    function getPathForTokensToTokens(
        address tokenAddressA,
        address tokenAddressB
    ) private pure returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = tokenAddressA;
        path[1] = tokenAddressB;
        return path;
    }

    function addLiquidity(
        address token,
        address to,
        uint256 tokenAmount,
        uint256 ethAmount
    ) external {
        // approve token transfer to cover all possible scenarios
        IERC20(token).approve(address(dexRouter), type(uint256).max);

        // add the liquidity
        dexRouter.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            to, // send lp tokens to owner
            block.timestamp + 10000
        );
    }

    // IERC20(paymentTokenAddress).approve(self(), type(uint256).max);
    function getTokensValueInUSD(address _tokenAddress, uint256 _amount)
        public
        view
        returns (uint256)
    {
        uint256 nativeNetworkCurrencyPrice = uint256(
            chainlinkDataFeedsManager.getLatestPriceFromChainlink()
        ) * 1e10;
        address[] memory path = new address[](3);
        path[0] = _tokenAddress;
        path[1] = getNativeTokenAddress(networkId);
        path[2] = getStableCoinAddress(networkId);
        uint256[] memory amountsOut = dexRouter.getAmountsOut(_amount, path);
        uint256 tokenAmount = amountsOut[1];
        return (nativeNetworkCurrencyPrice * tokenAmount) / 1000000000000000000;
    }
}
