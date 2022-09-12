// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PulseTroll is ERC20, Ownable {
    mapping(address => bool) private claimList;
    mapping(address => uint256) private claimListAmounts;
    uint256 claimMaxDate;
    uint256 claimMaxInterval;

    constructor() ERC20("PulseTroll", "PT") {
        _mint(msg.sender, 37000000000 * 10**decimals());
        claimMaxInterval = 69 days;
        claimMaxDate = block.timestamp + claimMaxInterval;
    }

    /**
     * @notice Update max claim interval
     */
    function updateClaimMaxInterval(uint256 val) external onlyOwner {
        claimMaxInterval = val;
    }

    /**
     * @notice Update max claim date
     */
    function updateClaimMaxDate(uint256 val) external onlyOwner {
        claimMaxDate = val;
    }

    /**
     * @notice Add or remove user from claimable list
     */
    function updateClaimListAccount(address account, bool val)
        external
        onlyOwner
    {
        claimList[account] = val;
    }

    /**
     * @notice Add or remove users from claimable list
     */
    function updateClaimListAccounts(address[] memory accounts, bool val)
        external
        onlyOwner
    {
        for (uint256 index = 0; index < accounts.length; index++) {
            claimList[accounts[index]] = val;
        }
    }

    /**
     * @notice Claim tokens, users only can claim once
     */
    function claim() external {
        require(block.timestamp < claimMaxDate, "max claim date limit");
        require(claimList[msg.sender], "not in claim list");
        require(claimListAmounts[msg.sender] == 0, "already claim");
        claimListAmounts[msg.sender] = 1420369000000000000000000;
        _mint(msg.sender, 1420369000000000000000000);
    }

    /**
     * @notice Allow mint new tokens
     * @param to user address who will receive tokens
     * @param amount numbers of tokens
     */
    function mint(address to, uint256 amount) internal {
        _mint(to, amount);
    }

    /**
     * @notice Return true or false if user can claim or not
     * @param account user address
     */
    function canClaim(address account) external view virtual returns (bool) {
        return claimList[account];
    }
}
