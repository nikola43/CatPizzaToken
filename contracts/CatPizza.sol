// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./midas/MidasMultinetworkRouterManager.sol";

contract CatPizza is ERC20 {
    // ADDRESSESS -------------------------------------------------------------------------------------------
    address public owner; // contract owner
    address public DEAD; // DEAD Address for burn tokens
    address public lpPair; // Liquidity token address
    address public swapTokenAddress; // tokens who contract will receive after swap
    address public marketingAddress; // fee wallet address

    // VALUES -----------------------------------------------------------------------------------------------
    uint256 public swapThreshold; // swap tokens limit
    uint256 masterTaxDivisor; // divisor | 0.0001 max presition fee
    uint256 maxWalletAmount; // max balance amount (Anti-whale)
    uint256 marketingAddressPercent;
    uint256 autoLiquidityPercent;
    uint256 maxTransactionAmount;

    // BOOLEANS ---------------------------------------------------------------------------------------------
    bool inSwap; // used for dont take fee on swaps
    bool tradingEnabled;

    // MAPPINGS
    mapping(address => bool) private _isExcludedFromFee; // list of users excluded from fee
    mapping(address => bool) public automatedMarketMakerPairs;

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
    MidasMultinetworkRouterManager public midasMultinetworkRouterManager; // router instance for do swaps
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

        maxWalletAmount = 1000000000000000000000000;
        maxTransactionAmount = 1000000000000000000000000;

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
        _isExcludedFromFee[swapTokenAddress] = true;

        // contract do swap when have 1M tokens balance
        swapThreshold = 1000000000000000000000000;

        marketingAddressPercent = 7000; //70%
        autoLiquidityPercent = 3000; //30%

        // Set Router Address (Pancake by default)
        address currentRouter = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
        address chainlinkDataFeedsAddress = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;

        midasMultinetworkRouterManager = new MidasMultinetworkRouterManager(
            currentRouter,
            chainlinkDataFeedsAddress
        );

        // Create a uniswap pair for this new token
        lpPair = IUniswapV2Factory(
            midasMultinetworkRouterManager.getDexRouter().factory()
        ).createPair(
                address(this),
                midasMultinetworkRouterManager.getDexRouter().WAVAX()
            );
        automatedMarketMakerPairs[lpPair] = true;

        // do approve to router from owner and contract
        _approve(
            msg.sender,
            midasMultinetworkRouterManager.getDexRouterAddress(),
            type(uint256).max
        );
        _approve(
            address(this),
            midasMultinetworkRouterManager.getDexRouterAddress(),
            type(uint256).max
        );
        _approve(
            swapTokenAddress,
            midasMultinetworkRouterManager.getDexRouterAddress(),
            type(uint256).max
        );

        // few values needed for contract works
        DEAD = 0x000000000000000000000000000000000000dEaD; // dead address for burn
        masterTaxDivisor = 10000;
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
            super._transfer(from, address(this), feeAmount);
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

    function swapTokensForBNB(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = midasMultinetworkRouterManager.getDexRouter().WAVAX();

        // make the swap
        midasMultinetworkRouterManager
            .getDexRouter()
            .swapExactTokensForETHSupportingFeeOnTransferTokens(
                tokenAmount,
                0, // accept any amount of ETH
                path,
                address(this),
                block.timestamp + 1000
            );
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
        uint256 contractTokenBalance = balanceOf(address(this));
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

    function setMarketingAddressPercent(uint256 value)
        public
        virtual
        onlyOwner
    {
        marketingAddressPercent = value;
    }

    function setAutoLiquidityPercentPercent(uint256 value)
        public
        virtual
        onlyOwner
    {
        autoLiquidityPercent = value;
    }
}
