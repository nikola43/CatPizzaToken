// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CatPizza is ERC20 {
    // ADDRESSESS -------------------------------------------------------------------------------------------
    address public owner; // contract owner
    address public DEAD; // DEAD Address for burn tokens
    address public lpPair; // Liquidity token address
    address public swapTokenAddress; // tokens who contract will receive after swap
    address public marketingAddress; // fee wallet address

    // VALUES -----------------------------------------------------------------------------------------------
    uint256 public swapThreshold; // swap tokens limit
    uint256 MAX_INT; // max solidity number
    uint256 masterTaxDivisor; // divisor | 0.0001 max presition fee

    // BOOLEANS ---------------------------------------------------------------------------------------------
    bool inSwap; // used for dont take fee on swaps
    bool public tradingActive; // enable or disable trading

    // MAPPINGS
    mapping(address => bool) private _isExcludedFromFee; // list of users excluded from fee
    mapping(address => bool) public automatedMarketMakerPairs; // list of enabled LP pairs

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
    constructor() ERC20("CatPizza", "CatP") {
        // mint tokens to deployer
        _mint(msg.sender, 100000000000000000000000000);

        // set owner address (by default -> deployer address)
        owner = msg.sender;

        // marketing address
        marketingAddress = 0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4;

        // default fees
        // 3% on BUY
        // 3% on SELL
        // 0% on Transfer
        _feesRates = Fees({buyFee: 300, sellFee: 300, transferFee: 0});

        // swap tokens for usdt
        swapTokenAddress = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7;

        // exclude from fees
        // owner, token and marketing address
        _isExcludedFromFee[owner] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromFee[marketingAddress] = true;

        // by default trading is active after add liquidity
        tradingActive = true;

        // contract do swap when have 1M tokens balance
        swapThreshold = 1000000000000000000000000;

        // Set Router Address (Pancake by default)
        address currentRouter = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
        dexRouter = IUniswapV2Router02(currentRouter);

        // do approve to router from owner and contract
        _approve(msg.sender, currentRouter, type(uint256).max);
        _approve(address(this), currentRouter, type(uint256).max);

        // few values needed for contract works
        DEAD = 0x000000000000000000000000000000000000dEaD; // dead address for burn
        MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff; // max solidiy number
        masterTaxDivisor = 10000;
    }

    // To receive BNB from dexRouter when swapping
    receive() external payable virtual {}

    // get contract owner address
    function getOwner() external view virtual returns (address) {
        return owner;
    }

    // enable trading (swap) and set initial block
    function enableTrading(bool value) public virtual onlyOwner {
        tradingActive = value;
    }

    // Set fees
    function setTaxes(
        uint16 buyFee,
        uint16 sellFee,
        uint16 transferFee
    ) external virtual onlyOwner {
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

        // check if current tx is swap
        if (inSwap) {
            super._transfer(from, to, amount);
            return;
        }

        // check if contract should swap
        if (contractMustSwap(from, to)) {
            contractSwap();
        }

        // do transfer and take fees
        _finalizeTransfer(from, to, amount);
    }

    // function for enable or disable trading
    function updateTradingEnable(bool newValue) external virtual onlyOwner {
        tradingActive = newValue;
    }

    function _finalizeTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        // by default receiver receive 100% of sended amount
        uint256 amountReceived = amount;
        uint256 feeAmount = 0; // received fee amount is zero

        // by default we take fees
        bool takeFee = true;

        // check if from or two address are excluded
        if (_isExcludedFromFee[from] || _isExcludedFromFee[to]) {
            takeFee = false;
        }

        // check if we need take fee or not
        if (takeFee) {
            // if we need take fee
            // calc how much we need take
            feeAmount = calcBuySellTransferFee(from, to, amount);

            // if fee amount is greather than zero
            if (feeAmount > 0) {
                // we substract fee amount from recipient amount
                amountReceived = amount - feeAmount;

                // and transfer fee to contract
                super._transfer(from, address(this), feeAmount);
            }
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

    function contractSwap() internal virtual swapping {
        // Get contract tokens balance
        uint256 numTokensToSwap = balanceOf(address(this));

        uint256 marketingAddressPercent = 7000;
        uint256 autoLiquidityPercent = 3000;

        // swap tokens
        swapTokensForTokens((numTokensToSwap * marketingAddressPercent) / masterTaxDivisor);

        // send
        // auto liquiidty
        // half token swap to bnb
        // 15% - tokens
        autoLiquidity((numTokensToSwap * autoLiquidityPercent) / masterTaxDivisor);
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

    function swapTokensForTokens(uint256 tokenAmount) private {
        // Generate router path
        // Token -> swapTokenAddress (BNB, USDT, ETH, wBTC)
        address[] memory tokensPath = getPathForTokensToTokens(
            address(this),
            swapTokenAddress
        );

        // Do approve for router spend swap token amount
        IERC20(swapTokenAddress).approve(address(dexRouter), tokenAmount);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            tokensPath,
            marketingAddress,
            block.timestamp + 10000);
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = dexRouter.WETH();

        _approve(address(this), address(dexRouter), tokenAmount);

        // make the swap
        dexRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp + 10000
        );
    }

    function autoLiquidity(uint256 tokenAmount) public {
        // split the contract balance into halves
        uint256 half = tokenAmount / 2;
        uint256 otherHalf = tokenAmount - half;

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForBNB(half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance - initialBalance;

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(dexRouter), tokenAmount);

        // add the liquidity
        dexRouter.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner, // send lp tokens to owner
            block.timestamp + 10000
        );
    }

    function _hasLimits(address from, address to) private view returns (bool) {
        return
            from != owner &&
            to != owner &&
            tx.origin != owner &&
            to != DEAD &&
            to != address(0) &&
            from != address(this);
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

        if (_hasLimits(from, to)) {
            if (!tradingActive) {
                revert("Trading not yet enabled!");
            }
        }
    }

    function contractMustSwap(address from, address to)
        internal
        view
        virtual
        returns (bool)
    {
        uint256 contractTokenBalance = balanceOf(address(this));
        return
            contractTokenBalance >= swapThreshold &&
            !inSwap &&
            from != lpPair &&
            balanceOf(lpPair) > 0 &&
            !_isExcludedFromFee[to] &&
            !_isExcludedFromFee[from];
    }

    function burn(address to, uint256 amount) public virtual {
        require(amount >= 0, "Burn amount should be greater than ZERO_ADDRESS");

        if (msg.sender != to) {
            uint256 currentAllowance = allowance(to, msg.sender);
            if (currentAllowance != type(uint256).max) {
                require(
                    currentAllowance >= amount,
                    "ERC20: transfer amount exceeds allowance"
                );
            }
        }

        require(
            amount <= balanceOf(to),
            "Burn amount should be less than account balance"
        );

        super._burn(to, amount);
        emit Burn(to, amount);
    }

    function setMarketingAddress(address account) public virtual onlyOwner {
        marketingAddress = account;
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
}
