// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
import "./IMidasMultiNetworkRouter.sol";

interface MidasMultiNetworkRouterManager {
    function getDexRouter() external view returns (IMidasMultiNetworkRouter);

    function isInSwap() external view returns (bool);

    function getNativeNetworkCurrencyAddress(uint256 networkId)
        external
        pure
        returns (address);

    function getDexRouterAddress() external view returns (address);

    function swapTokensForStableCoin(address to, uint256 amount) external;

    function swapTokensForBNB(
        address token,
        address to,
        uint256 amount
    ) external;

    function addLiquidity(
        address token,
        address to,
        uint256 tokenAmount,
        uint256 ethAmount
    ) external;
}
