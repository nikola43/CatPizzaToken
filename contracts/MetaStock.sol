// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Utils.sol";

contract MetaStock is ERC20 {
    // ADDRESSESS -------------------------------------------------------------------------------------------
    address public owner; // contract owner
    address public DEAD = 0x000000000000000000000000000000000000dEaD; // DEAD Address for burn tokens
    address public lpPair; // Liquidity token address
    address public swapTokenAddress =
        0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7; // tokens who contract will receive after swap

    address public charityWallet = 0x492A9CE7f973958454fcBcae0E22985e15cdBE58; // charity wallet address
    address[] public teamWallets = new address[](10);
    uint256[] public teamWalletsPercentages = new uint256[](10);

    address routerAddress = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;

    // VALUES -----------------------------------------------------------------------------------------------
    uint256 public swapThreshold = 1000000000000000000000000; // swap tokens limit
    uint256 masterTaxDivisor = 10000; // divisor | 0.0001 max presition fee
    uint256 maxWalletAmount = 1000000000000000000000000; // max balance amount (Anti-whale)

    uint256 teamPercent = 5000;
    uint256 autoLiquidityPercent = 2000;
    uint256 buyBackPercent = 2000;
    uint256 charityPercent = 1000;
    uint256 maxTransactionAmount = 1000000000000000000000000;

    // BOOLEANS ---------------------------------------------------------------------------------------------
    bool inSwap; // used for dont take fee on swaps
    bool tradingEnabled;

    // MAPPINGS
    mapping(address => bool) private _isExcludedFromFee; // list of users excluded from fee
    mapping(address => bool) public automatedMarketMakerPairs;
    mapping(address => uint256) public usersLastSellsDates;

    // EVENTS -----------------------------------------------------------------------------------------------
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event Burn(address indexed sender, uint256 amount);

    // STRUCTS ----------------------------------------------------------------------------------------------
    struct Fees {
        uint16 buyFee; // fee when people BUY tokens
        uint16 sellFee; // fee when people SELL tokens
        uint16 transferFee; // fee when people TRANSFER tokens
    }

    // OBJECTS ----------------------------------------------------------------------------------------------
    IUniswapV2Router02 public dexRouter; // router instance for do swaps
    Fees public _feesRates; // fees rates
    MetaStockUtils metaStockUtils = new MetaStockUtils();

    // MODIFIERS --------------------------------------------------------------------------------------------
    modifier swapping() {
        inSwap = true;
        _;
        inSwap = false;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    // CONSTRUCTOR ------------------------------------------------------------------------------------------
    constructor() ERC20("MetaStock", "MSK") {
        // mint tokens to deployer
        _mint(msg.sender, 100000000000000000000000000);

        // set owner address (by default -> deployer address)
        owner = msg.sender;

        // default fees
        // 0% on BUY
        // 3% on SELL
        // 0% on Transfer
        _feesRates = Fees({buyFee: 0, sellFee: 300, transferFee: 0});

        // exclude from fees
        // owner, token
        _isExcludedFromFee[owner] = true;
        _isExcludedFromFee[address(this)] = true;

        // Set Router Address (Pancake by default)
        dexRouter = IUniswapV2Router02(routerAddress);

        // Create a uniswap pair for this new token
        lpPair = IUniswapV2Factory(dexRouter.factory()).createPair(
            address(this),
            dexRouter.WETH()
        );
        automatedMarketMakerPairs[lpPair] = true;

        // do approve to router from owner and contract
        _approve(msg.sender, routerAddress, type(uint256).max);
        _approve(address(this), routerAddress, type(uint256).max);
        _approve(swapTokenAddress, routerAddress, type(uint256).max);

        teamWallets[0] = 0x4CF4525Ea8225ef715236538a3D7F06151BfEe11;
        teamWalletsPercentages[0] = 2000;
        teamWallets[1] = 0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4;
        teamWalletsPercentages[1] = 1600;
        teamWallets[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        teamWalletsPercentages[2] = 3000;
        teamWallets[3] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        teamWalletsPercentages[3] = 500;
        teamWallets[4] = 0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8;
        teamWalletsPercentages[4] = 2900;
        teamWallets[5] = 0x4CF4525Ea8225ef715236538a3D7F06151BfEe11;
        teamWalletsPercentages[5] = 2000;
    }

    // get contract owner address
    function self() internal view virtual returns (address) {
        return address(this);
    }

    // To receive BNB from dexRouter when swapping
    receive() external payable virtual {}

    // get contract owner address
    function getOwner() external view virtual returns (address) {
        return owner;
    }

    // Set fees
    function setTaxes(
        uint16 buyFee,
        uint16 sellFee,
        uint16 transferFee
    ) external virtual onlyOwner {
        require(buyFee <= 3000, "MAX BUY FEES");
        require(sellFee <= 3000, "MAX SELL FEES");
        require(transferFee <= 3000, "MAX TRANSFER FEES");
        require(
            buyFee + sellFee + transferFee <= 3000,
            "MAX BUY, SELL, TRANSFER FEES"
        );
        _feesRates.buyFee = buyFee;
        _feesRates.sellFee = sellFee;
        _feesRates.transferFee = transferFee;
    }

    // transfer owner
    function transferOwnership(address account) public virtual onlyOwner {
        owner = account;
    }

    // this function will be called every buy, sell or transfer
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        // check before each tx
        _beforeTransferCheck(from, to, amount);

        // if transaction are internal transfer when contract is swapping
        // transfer no fee
        if (inSwap) {
            super._transfer(from, to, amount);
            return;
        }

        // DO SWAP AND AUTOLIQUIDITY
        if (contractMustSwap(from, to)) {
            // SWAP
            // Get contract tokens balance
            uint256 numTokensToSwap = balanceOf(self());

            // swap teamPercent of tokens
            metaStockUtils.swapTokensForUSD(
                dexRouter,
                self(),
                swapTokenAddress,
                (numTokensToSwap * teamPercent) / masterTaxDivisor
            );

            // send team percentage
            metaStockUtils.sendToTeam(
                self(),
                teamWallets,
                teamWalletsPercentages
            );

            // // inject liquidity
            metaStockUtils.autoLiquidity(
                dexRouter,
                self(),
                (numTokensToSwap * autoLiquidityPercent) / masterTaxDivisor,
                owner
            );

            // send to charity
            IERC20(self()).transfer(
                charityWallet,
                (numTokensToSwap * charityPercent) / masterTaxDivisor
            );
        }

        _finalizeTransfer(from, to, amount);
    }

    function _finalizeTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        // by default receiver receive 100% of sended amount
        uint256 amountReceived = amount;
        uint256 feeAmount = 0; // received fee amount is zero

        // If takeFee is false there is 0% fee
        bool takeFee = true;
        if (_isExcludedFromFee[from] || _isExcludedFromFee[to]) {
            takeFee = false;
        }

        // check if we need take fee or not
        if (takeFee) {
            // if we need take fee
            // calc how much we need take
            feeAmount = calcBuySellTransferFee(from, to, amount);

            // we substract fee amount from recipient amount
            amountReceived = amount - feeAmount;

            // and transfer fee to contract
            super._transfer(from, self(), feeAmount);
        }

        // finally send remaining tokens to recipient
        super._transfer(from, to, amountReceived);
    }

    function calcBuySellTransferFee(
        address from,
        address to,
        uint256 amount
    ) internal view virtual returns (uint256) {
        // by default we take zero fee
        uint256 totalFeePercent = 0;
        uint256 feeAmount = 0;

        // BUY -> FROM == LP ADDRESS
        if (automatedMarketMakerPairs[from]) {
            totalFeePercent += _feesRates.buyFee;
        }
        // SELL -> TO == LP ADDRESS
        else if (automatedMarketMakerPairs[to]) {
            totalFeePercent += _feesRates.sellFee;
        }
        // TRANSFER
        else {
            totalFeePercent += _feesRates.transferFee;
        }

        // CALC FEES AMOUT
        if (totalFeePercent > 0) {
            feeAmount = (amount * totalFeePercent) / masterTaxDivisor;
        }

        return feeAmount;
    }

    function _beforeTransferCheck(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(
            from != address(0),
            "ERC20: transfer from the ZERO_ADDRESS address"
        );
        require(
            to != address(0),
            "ERC20: transfer to the ZERO_ADDRESS address"
        );
        require(
            amount > 0,
            "Transfer amount must be greater than ZERO_ADDRESS"
        );

        if (
            from != owner &&
            to != owner &&
            to != address(0) &&
            to != address(0xdead) &&
            !inSwap
        ) {
            require(tradingEnabled, "Trading not active");

            // BUY -> FROM == LP ADDRESS
            if (automatedMarketMakerPairs[from]) {
                require(
                    amount <= maxTransactionAmount,
                    "Buy transfer amount exceeds the maxTransactionAmount."
                );
                require(
                    amount + balanceOf(to) <= maxWalletAmount,
                    "Max wallet exceeded"
                );
            }
            // SELL -> TO == LP ADDRESS
            else if (automatedMarketMakerPairs[to]) {
                require(
                    amount <= maxTransactionAmount,
                    "Sell transfer amount exceeds the maxTransactionAmount."
                );

                // todo add sell max limit
                usersLastSellsDates[from] = block.timestamp;
            }
            // TRANSFER
            else {
                require(
                    amount + balanceOf(to) <= maxWalletAmount,
                    "Max wallet exceeded"
                );
            }
        }
    }

    function contractMustSwap(address from, address to)
        internal
        view
        virtual
        returns (bool)
    {
        uint256 contractTokenBalance = balanceOf(self());
        return
            contractTokenBalance >= swapThreshold &&
            !inSwap &&
            from != lpPair &&
            balanceOf(lpPair) > 0 &&
            !_isExcludedFromFee[to] &&
            !_isExcludedFromFee[from];
    }

    function burn(uint256 amount) public virtual {
        require(amount >= 0, "Burn amount should be greater than ZERO_ADDRESS");

        require(
            amount <= balanceOf(msg.sender),
            "Burn amount should be less than account balance"
        );

        super._burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    function isExcludedFromFee(address account)
        public
        view
        virtual
        returns (bool)
    {
        return _isExcludedFromFee[account];
    }

    function excludeFromFee(address account, bool val)
        public
        virtual
        onlyOwner
    {
        _isExcludedFromFee[account] = val;
    }

    function setSwapThreshold(uint256 value) public virtual onlyOwner {
        swapThreshold = value;
    }

    function setMaxWalletAmount(uint256 value) public virtual onlyOwner {
        maxWalletAmount = value;
    }

    function setMaxTransactionAmount(uint256 value) public virtual onlyOwner {
        maxTransactionAmount = value;
    }

    function enableTrading() public virtual onlyOwner {
        require(tradingEnabled == false, "TradingEnabled already actived");
        tradingEnabled = true;
    }
}
