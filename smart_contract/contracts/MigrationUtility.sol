pragma solidity ^0.4.19;

import "./IToken.sol";
import "./LSafeMath.sol";

// For exchanges that have the same functions as EtherDelta, we call them EtherDelta-like contracts
contract EtherDelta {
    function balanceOf(address token, address user) public view returns (uint);
    // Withdraw only Ether
    function withdraw(uint amount);
    // Withdraw specific token
    function withdrawToken(address token, uint amount);
    // Deposit only ether
    function deposit() payable;
    // Deposit specific token
    function depositToken(address token, uint amount);
}

// For exchanges that have the same functions as EtherDelta, we call them EtherDelta-like contracts
contract ForkDelta {
    function balanceOf(address token, address user) public view returns (uint);
    // Withdraw only Ether
    function withdraw(uint amount);
    // Withdraw specific token
    function withdrawToken(address token, uint amount);
    // Deposit only ether
    function deposit() payable;
    // Deposit specific token
    function depositToken(address token, uint amount);
    // Deposit only ether for specific user
    function depositForUser(address user) public payable;
}

contract MigrationUtility {

    using LSafeMath for uint;

    /// Variables
    address public admin; // the admin address
    address public fee; // Possible fee if migration made into separate app should always be 0.1%
    mapping (address => mapping (address => uint)) public tokenBalances; // mapping of token addresses to mapping of account balances (token=0 means Ether)

    /* Constructor - called on creation of contract */
    function MigrationUtility(address admin_, address fee_) public {
        admin = admin_;
        fee =  fee_;
    }

    /// This is a modifier for functions to check if the sending user address is the same as the admin user address.
    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }

    /// Changes the official admin user address.
    function changeAdmin(address admin_) public isAdmin {
        require(admin != 0);
        require(admin_ != address(0));
        admin = admin_;
    }

    ///================================================================================
    /// Transferring Balances
    ///================================================================================
    /* Transfer balances from EtherDelta-like contract to ForkDelta-like contract*/
    function transferEDtoFDBalances(address exchangeFrom, address exchangeTo, address user, address[] transferTokens) public {
         // Exchange from
        EtherDelta exFrom = EtherDelta(exchangeFrom);
        // Exchange to
        ForkDelta exTo = ForkDelta(exchangeTo);

        // Current token balance
        uint balance;

        // Withdraw and transfer balances on exchangeFrom to exchangeTo
        for (uint i = 0; i < transferTokens.length; i++){
            // Get token balances on exchangeFrom
            balance = exFrom.balanceOf(transferTokens[i], user);
            // Handle Ether transfer from old to new contract
            if (transferTokens[i] == 0) {
                exFrom.withdraw(balance);777
                exTo.depositForUser.value(balance)(user);
            // Handle all other token transfers from old to new contract
            } else {
                // Withdraw to this contract
                exFrom.withdrawToken(transferTokens[i], balance);

                // Approve of transfer from this contract
                IToken(transferTokens[i]).transfer(this, balance);

                // Deposite token into exTo contract
                exTo.depositToken(transferTokens[i], balance);
            }
        }
    }


    ///================================================================================
    /// Checking Balances
    ///================================================================================
    /* Get multiple token balances on EtherDelta (or similar exchange)
           Returns array of token balances in wei units. */
    function deltaBalances(
    address exchange,
    address user,
    address[] tokens)
    public view returns (uint[]) {
        EtherDelta ex = EtherDelta(exchange);
        uint[] memory balances = new uint[](tokens.length);

        for (uint i = 0; i < tokens.length; i++) {
          balances[i] = ex.balanceOf(tokens[i], user);
        }
        return balances;
    }

    /* Get multiple token balances on EtherDelta (or similar exchange)
       Returns array of token balances in wei units.
       Balances in token-first order [token0ex0, token0ex1, token0ex2, token1ex0, token1ex1 ...] */
    function multiDeltaBalances(
    address[] exchanges,
    address user,
    address[] tokens)
    public view returns (uint[]) {
        uint[] memory balances = new uint[](tokens.length * exchanges.length);

        for (uint i = 0; i < exchanges.length; i++){
            EtherDelta ex = EtherDelta(exchanges[i]);
            for (uint j = 0; j < tokens.length; j++){
                balances[(j * exchanges.length) + i] = ex.balanceOf(tokens[j], user);
            }
        }
        return balances;
    }

    /* Check the token balance of a wallet in a token contract
       Mainly for internal use, but public for anyone who thinks it is useful    */
    function tokenBalance(
    address user,
    address token)
    public view returns (uint) {
        //  check if token is actually a contract
        uint256 tokenCode;
        assembly {tokenCode := extcodesize(token)} // contract code size
        if (tokenCode > 0){
            IToken tok = IToken(token);
            //  check if balanceOf succeeds
            if (tok.call(bytes4(keccak256("balanceOf(address)")), user)) {
                return tok.balanceOf(user);
            } else {
                return 0; // not a valid balanceOf, return 0 instead of error
            }
        } else {
            return 0; // not a contract, return 0 instead of error
        }
    }

    /* Check the token balances of a wallet for multiple tokens
       Uses tokenBalance() to be able to return, even if a token isn't valid
       Returns array of token balances in wei units. */
    function walletBalances(
    address user,
    address[] tokens)
    public view returns (uint[]) {
        require(tokens.length > 0);
        uint[] memory balances = new uint[](tokens.length);

        for (uint i = 0; i < tokens.length; i++){
            if (tokens[i] != address(0x0)) {// ETH address in Etherdelta config
                balances[i] = tokenBalance(user, tokens[i]);
            }
            else {
                balances[i] = user.balance; // eth balance
            }
        }
        return balances;
    }

    /* Combine walletBalances() and deltaBalances() to get both exchange and wallet balances for multiple tokens.
      Returns array of token balances in wei units, 2* input length.
      even index [0] is exchange balance, odd [1] is wallet balance
      [tok0ex, tok0, tok1ex, tok1, .. ] */
//    function allBalances(
//    address exchange,
//    address user,
//    address[] tokens)
//    public view returns (uint[]) {
//        EtherDelta ex = EtherDelta(exchange);
//        uint[] memory balances = new uint[](tokens.length * 2);
//
//        for (uint i = 0; i < tokens.length; i++){
//            uint j = i * 2;
//            balances[j] = ex.balanceOf(tokens[i], user);
//            if (tokens[i] != address(0x0)) {// ETH address in Etherdelta config
//                balances[j + 1] = tokenBalance(user, tokens[i]);
//            } else {
//                balances[j + 1] = user.balance; // eth balance
//            }
//        }
//        return balances;
//    }
}

