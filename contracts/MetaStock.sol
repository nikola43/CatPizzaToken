// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MetaStock is ERC20 {
    // ADDRESSESS -------------------------------------------------------------------------------------------
    address public owner; // contract owner
    address public DEAD = 0x000000000000000000000000000000000000dEaD; // DEAD Address for burn tokens
    address public lpPair; // Liquidity token address
    address public usdAddress = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7; // usd
    address routerAddress = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
    address[] distributionWallets = new address[](10);

    // VALUES -----------------------------------------------------------------------------------------------
    uint256 public swapThreshold = 4000000000000000000000; // 4000 swap tokens limit
    uint256 masterTaxDivisor = 10000; // divisor | 0.0001 max presition fee
    uint256 maxWalletAmount = 1000000000000000000000000; // max balance amount (Anti-whale)
    uint256 maxTransactionAmount = 1000000000000000000000000;

    // Distribution percentages
    uint256 teamPercent = 5000; // 50%
    uint256 autoLiquidityPercent = 2000; // 20%
    uint256 buyBackPercent = 2000; // 20%
    uint256 burnPercent = 1000; // 10%

    uint256[] distributionWalletsPercentages = new uint256[](10);

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
        // 0% on BUY
        // 3% on SELL
        // 0% on Transfer
        _feesRates = Fees({buyFee: 0, sellFee: 300, transferFee: 0});

        // exclude from fees
        // owner, token
        _isExcludedFromFee[owner] = true;
        _isExcludedFromFee[address(this)] = true;

        initializeRouterAndPair();

        // do approve to router from owner and contract
        _approve(msg.sender, routerAddress, type(uint256).max);
        _approve(address(this), routerAddress, type(uint256).max);
        _approve(usdAddress, routerAddress, type(uint256).max);
        _approve(usdAddress, address(this), type(uint256).max);

        distributionWallets[0] = 0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4; // w1
        distributionWallets[1] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // w2
        distributionWallets[2] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906; // w3
        distributionWallets[3] = 0xfbAA3c716dA6378A0840754185BFf6A05a20e1C8; // w4
        distributionWallets[4] = 0x4CF4525Ea8225ef715236538a3D7F06151BfEe11; // w5
        distributionWallets[5] = 0x492A9CE7f973958454fcBcae0E22985e15cdBE58; // charity

        //distributionWalletsPercentages[0] = 1600; // 16%
        //distributionWalletsPercentages[1] = 2000; // 20%
        //distributionWalletsPercentages[2] = 500; // 5%
        //distributionWalletsPercentages[3] = 2900; // 29%
        //distributionWalletsPercentages[4] = 2000; // 20%
        //distributionWalletsPercentages[5] = 1000; // 10%

        distributionWalletsPercentages[0] = 100; // 16%
        distributionWalletsPercentages[1] = 100; // 20%
        distributionWalletsPercentages[2] = 100; // 5%
        distributionWalletsPercentages[3] = 100; // 29%
        distributionWalletsPercentages[4] = 100; // 20%
        distributionWalletsPercentages[5] = 100; // 10%
    }

    /**
     * @notice Standar function for receive BNB
     */
    receive() external payable virtual {}

    /**
     * @notice Get contract address
     */
    function self() internal view virtual returns (address) {
        return address(this);
    }

    /**
     * @notice Initialize router and create LP pair address
     */
    function initializeRouterAndPair() internal virtual {
        // Initialize router
        dexRouter = IUniswapV2Router02(routerAddress);

        // Create a uniswap pair for this new token
        lpPair = IUniswapV2Factory(dexRouter.factory()).createPair(
            self(),
            dexRouter.WETH()
        );

        automatedMarketMakerPairs[lpPair] = true;
    }

    /**
     * @notice Get contract owner address
     */
    function getOwner() external view virtual returns (address) {
        return owner;
    }

    /**
     * @notice Sets the percentage of tokens to be subtracted when users buy, sell or transfer tokens
     * @param buyFeePercentage Percentage subtracted when the user is a BUY TX
     * @param sellFeePercentage Percentage subtracted when the user is a SELL TX
     * @param transferPercentage Percentage subtracted when the user is a TRANSFER TX
     */
    function setTaxes(
        uint16 buyFeePercentage,
        uint16 sellFeePercentage,
        uint16 transferPercentage
    ) external virtual onlyOwner {
        require(buyFeePercentage <= 3000, "MAX BUY FEES");
        require(sellFeePercentage <= 3000, "MAX SELL FEES");
        require(transferPercentage <= 3000, "MAX TRANSFER FEES");
        require(
            buyFeePercentage + sellFeePercentage + transferPercentage <= 3000,
            "MAX BUY, SELL, TRANSFER FEES"
        );
        _feesRates.buyFee = buyFeePercentage;
        _feesRates.sellFee = sellFeePercentage;
        _feesRates.transferFee = transferPercentage;
    }

    // transfer owner
    function transferOwnership(address account) public virtual onlyOwner {
        owner = account;
        //emit OwnershipTransferred()
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
        // Get contract tokens balance
        uint256 contractTokenBalance = balanceOf(self());
        bool mustContract = contractMustSwap(from, to, contractTokenBalance);
        console.log("contractTokenBalance", contractTokenBalance);
        console.log("mustContract", mustContract);
        if (mustContract) {
            console.log("DO SWAP");
            // swap teamPercent of tokens
            swapTokensForUSD(
                (contractTokenBalance * teamPercent) / masterTaxDivisor
            );

            // inject liquidity
            autoLiquidity(
                (contractTokenBalance * autoLiquidityPercent) / masterTaxDivisor
            );

            burn(
                self(),
                (contractTokenBalance * burnPercent) / masterTaxDivisor
            );

            uint256 usdBalance = IERC20(usdAddress).balanceOf(self());
            //console.log("usdBalance", usdBalance);
            swapUSDForTokens(usdBalance);

            // buyback
            /*

            */

            /*


            // burn

            */

            // send team percentage
            //distributeToWallets();
            /*
            uint256 usdBalance = IERC20(usdAddress).balanceOf(self());
            console.log("usdBalance", usdBalance);
            IERC20(usdAddress).transfer(
                0x6644ebDE0f26c8F74AD18697cce8A5aC4e608cB4,
                (usdBalance * distributionWalletsPercentages[0]) /
                    masterTaxDivisor
            );
            */
        }

        _takeFees(from, to, amount);
    }

    /**
     * @notice Send the USD collected to the team and to the charity wallet
     */
    function distributeToWallets() internal virtual {
        uint256 usdBalance = IERC20(usdAddress).balanceOf(self());
        console.log("usdBalance", usdBalance);
        for (uint256 index = 0; index < distributionWallets.length; index++) {
            IERC20(usdAddress).transfer(
                distributionWallets[index],
                (usdBalance * distributionWalletsPercentages[index]) /
                    masterTaxDivisor
            );
        }
    }

    function _takeFees(
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

    function swapUSDForTokens(uint256 usdAmount) private {
        address[] memory path = new address[](3);
        path[0] = usdAddress;
        path[1] = dexRouter.WETH();
        path[2] = self();

        // Do approve for router spend swap token amount
        //IERC20(usdAddress).approve(address(dexRouter), type(uint256).max);
        //IERC20(usdAddress).approve(self(), type(uint256).max);
        //IERC20(dexRouter.WETH()).approve(address(dexRouter), type(uint256).max);
        _approve(self(), address(dexRouter), type(uint256).max);
        _approve(self(), usdAddress, type(uint256).max);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            usdAmount,
            0,
            path,
            self(),
            block.timestamp + 10000
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
        path[0] = self();
        path[1] = dexRouter.WETH();
        path[2] = usdAddress;

        // Do approve for router spend swap token amount
        _approve(self(), address(dexRouter), tokenAmount);

        // swap and transfer to contract
        dexRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            self(),
            block.timestamp + 10000
        );
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = self();
        path[1] = dexRouter.WETH();

        _approve(self(), address(dexRouter), tokenAmount);

        // make the swap
        dexRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            self(),
            block.timestamp + 10000
        );
    }

    function autoLiquidity(uint256 tokenAmount) public {
        // split the contract balance into halves
        uint256 half = tokenAmount / 2;

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = self().balance;

        // swap tokens for BNB
        swapTokensForBNB(half);

        // how much ETH did we just swap into?
        uint256 newBalance = self().balance - initialBalance;

        // add liquidity to uniswap
        addLiquidity(half, newBalance);
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(self(), address(dexRouter), type(uint256).max);

        // add the liquidity
        dexRouter.addLiquidityETH{value: ethAmount}(
            self(),
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

    function contractMustSwap(
        address from,
        address to,
        uint256 contractTokenBalance
    ) internal view virtual returns (bool) {
        return
            contractTokenBalance >= swapThreshold &&
            !inSwap &&
            from != lpPair &&
            balanceOf(lpPair) > 0 &&
            !_isExcludedFromFee[to] &&
            !_isExcludedFromFee[from];
    }

    function burn(address from, uint256 amount) public virtual {
        require(amount >= 0, "Burn amount should be greater than ZERO_ADDRESS");

        require(
            amount <= balanceOf(from),
            "Burn amount should be less than account balance"
        );

        super._burn(from, amount);
        emit Burn(from, amount);
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
