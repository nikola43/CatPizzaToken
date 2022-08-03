// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaStock is ERC20 {
    // ADDRESSESS -------------------------------------------------------------------------------------------
    address public owner; // contract owner
    address public DEAD = 0x000000000000000000000000000000000000dEaD; // DEAD Address for burn tokens
    address public lpPair; // Liquidity token address
    address public swapTokenAddress =
        0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7; // tokens who contract will receive after swap
    address public w1Address = 0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4; // fee wallet address
    address public w2Address = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // fee wallet address
    address public w3Address = 0x90F79bf6EB2c4f870365E785982E1f101E93b906; // fee wallet address
    address public w4Address = 0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8; // fee wallet address
    address public w5Address = 0x4CF4525Ea8225ef715236538a3D7F06151BfEe11; // fee wallet address
    address public charityWallet = 0x492A9CE7f973958454fcBcae0E22985e15cdBE58; // charity wallet address
    address routerAddress = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;

    // VALUES -----------------------------------------------------------------------------------------------
    uint256 public swapThreshold = 1000000000000000000000000; // swap tokens limit
    uint256 masterTaxDivisor = 10000; // divisor | 0.0001 max presition fee
    uint256 maxWalletAmount = 1000000000000000000000000; // max balance amount (Anti-whale)
    uint256 w1AddressPercent = 1600;
    uint256 w2AddressPercent = 3000;
    uint256 w3AddressPercent = 500;
    uint256 w4AddressPercent = 2900;
    uint256 w5AddressPercent = 2000;
    uint256 teamPercent = 5000;
    uint256 autoLiquidityPercent = 2000;
    uint256 burnPercent = 2000;
    uint256 buyBackPercent = 2000;
    uint256 charityPercent = 1000;
    uint256 maxTransactionAmount = 1000000000000000000000000;

    // BOOLEANS ---------------------------------------------------------------------------------------------
    bool inSwap; // used for dont take fee on swaps
    bool tradingEnabled;

    // MAPPINGS
    mapping(address => bool) private _isExcludedFromFee; // list of users excluded from fee
    mapping(address => bool) public automatedMarketMakerPairs;
    mapping(address => uint256) public usersBuysCounter;
    mapping(address => uint256) public usersSellCounter;
    mapping(uint256 => uint256) public usersLastBuysTxs;
    mapping(uint256 => uint256) public usersLastSellsTxs;

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
    constructor() ERC20("MetaStock", "MSK") {
        // mint tokens to deployer
        _mint(msg.sender, 100000000000000000000000000);

        // set owner address (by default -> deployer address)
        owner = msg.sender;

        // default fees
        // 3% on BUY
        // 3% on SELL
        // 0% on Transfer
        _feesRates = Fees({buyFee: 0, sellFee: 300, transferFee: 0});

        // exclude from fees
        // owner, token and marketing address
        _isExcludedFromFee[owner] = true;
        _isExcludedFromFee[address(this)] = true;
        //_isExcludedFromFee[marketingAddress] = true;
        //_isExcludedFromFee[swapTokenAddress] = true;

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
            uint256 numTokensToSwap = balanceOf(address(this));

            // swap teamPercent of tokens
            swapTokensForUSD(
                (numTokensToSwap * teamPercent) / masterTaxDivisor
            );

            // buyback
            //swapUSDForTokens(buyBackPercent);

            // inject liquidity
            autoLiquidity(
                (numTokensToSwap * autoLiquidityPercent) / masterTaxDivisor
            );

            /*
            // send to charity
            IERC20(address(this)).transfer(
                charityWallet,
                (numTokensToSwap * charityPercent) / masterTaxDivisor
            );
            */

            // burn
            //burn((numTokensToSwap * burnPercent) / masterTaxDivisor);

            // send team percentage
            //_sendToTeam();
        }

        _finalizeTransfer(from, to, amount);
    }

    function _sendToTeam() internal virtual {
        uint256 usdBalance = IERC20(swapTokenAddress).balanceOf(address(this));

        IERC20(swapTokenAddress).transfer(
            w1Address,
            (usdBalance * w1AddressPercent) / masterTaxDivisor
        );
        IERC20(swapTokenAddress).transfer(
            w2Address,
            (usdBalance * w2AddressPercent) / masterTaxDivisor
        );
        IERC20(swapTokenAddress).transfer(
            w3Address,
            (usdBalance * w3AddressPercent) / masterTaxDivisor
        );
        IERC20(swapTokenAddress).transfer(
            w4Address,
            (usdBalance * w4AddressPercent) / masterTaxDivisor
        );
        IERC20(swapTokenAddress).transfer(
            w5Address,
            (usdBalance * w5AddressPercent) / masterTaxDivisor
        );
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

    function swapUSDForTokens(uint256 usdAmount) private {
        address[] memory path = new address[](3);
        path[0] = swapTokenAddress;
        path[1] = dexRouter.WETH();
        path[2] = address(this);

        // Do approve for router spend swap token amount
        IERC20(swapTokenAddress).approve(address(dexRouter), type(uint256).max);
        IERC20(dexRouter.WETH()).approve(address(dexRouter), type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            usdAmount,
            0,
            path,
            address(this),
            block.timestamp + 1000
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

    function swapTokensForUSD(uint256 tokenAmount) private {
        address[] memory path = new address[](3);
        path[0] = address(this);
        path[1] = dexRouter.WETH();
        path[2] = swapTokenAddress;

        // Do approve for router spend swap token amount
        IERC20(swapTokenAddress).approve(address(dexRouter), type(uint256).max);
        IERC20(dexRouter.WETH()).approve(address(dexRouter), type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp + 1000
        );
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
            block.timestamp + 1000
        );
    }

    function autoLiquidity(uint256 tokenAmount) public {
        // split the contract balance into halves
        uint256 half = tokenAmount / 2;

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
        addLiquidity(half, newBalance);
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(dexRouter), type(uint256).max);

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

                uint256 lastUserBuyTx = usersBuysCounter[from];
                usersBuysCounter[from] += 1;
                usersLastBuysTxs[lastUserBuyTx] = block.timestamp;
            }
            // SELL -> TO == LP ADDRESS
            else if (automatedMarketMakerPairs[to]) {
                require(
                    amount <= maxTransactionAmount,
                    "Sell transfer amount exceeds the maxTransactionAmount."
                );

                uint256 lastUserBuyTx = usersBuysCounter[from];
                uint256 lastUserSellTx = usersSellCounter[from];
                uint256 lastBuyTxDate = usersLastBuysTxs[lastUserBuyTx];
                usersSellCounter[from] += 1;
                usersLastSellsTxs[lastUserSellTx] = block.timestamp;

                /*
                // todo add sell max limit


                if (lastBuyTxDate - block.timestamp > 0) {
                    usersSellCounter[from] += 1;
                    usersLastSellsTxs[lastUserSellTx] = block.timestamp;
                } else {
                    //revert("daily sell limix exceded");
                }
                */
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
