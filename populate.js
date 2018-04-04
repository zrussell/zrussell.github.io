"use strict";
// React
import React from 'react';
import ReactDOM from 'react-dom';

const Web3 = require('web3');
const BN = require('bignumber.js');

import LoadingWindow from './components/windows/LoadingWindow'
import PopulationIntroductionWindow from './components/populate_windows/PopulationIntroductionWindow'
import LogicWindow from './components/populate_windows/LogicWindow'


class PopulationTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Initialize window to 0 (loading window)
            window: 0,
        };
    };

    /* --- Navigate to next window -- */
    nextWindow() {
        let current_window = this.state.window;
        if (current_window < 4) {
            current_window += 1;
            this.setState({
                window: current_window
            });
        }
    };

    /* --- Navigate to previous window -- */
    previousWindow() {
        let current_window = this.state.window;
        if (current_window > 1) {
            current_window -= 1;
            this.setState({
                window: current_window
            });
        }
    };

    /* --- Hides window --- */
    closeWindow() {
        document.getElementById('populationTool').style.display = 'none';
    }

    deposit_token(token_addr) {
        if (token_addr === "0x0000000000000000000000000000000000000000") {
            deposit_ether();
        } else if (typeof token_addr !== "undefined") {
            deposit_sample_token(token_addr);
        }
    }


    render() {
        // Determine current window
        let current_window;
        switch (this.state.window) {
            case 0:
                current_window = <LoadingWindow/>;
                break;
            case 1:
                current_window = <PopulationIntroductionWindow nextWindow={() => this.nextWindow()}
                                                               closeWindow={() => this.closeWindow()}/>;
                break;
            case 2:
                current_window = <LogicWindow closeWindow={() => this.closeWindow()}
                                              previousWindow={() => this.previousWindow()}
                                              populate={() => this.deposit_token()}
                                              populate_ether={() => this.deposit_token('0x0000000000000000000000000000000000000000')}
                                              populate_smpl={() => this.deposit_token('0xbd7657592864edf460724af8f839b0b09f2102c4')}
                                              populate_smpl2={() => this.deposit_token('0xb836985001d5227485b06be73f4cc132c32f4213')}
                                              populate_twld={() => this.deposit_token('0xf2ca14dea6456bac54d9501b55be0dc2e138a0fd')}
                                              populate_coin={() => this.deposit_token('0x4568a35c14ea30001ae5ea5158ae47e9009553c9')}/>;
                break;
        }

        return (
            // Modal body, with interchangeable nested window
            <div className="migration-overlay" id="migration-modal">
                <div className="modal-dialog" tabIndex="-1">
                    {current_window}
                </div>
            </div>
        )

    };
}

// React component initialization for front-end of population tool
var react_component = ReactDOM.render(<PopulationTool/>, document.getElementById('populationTool'));


// Fetch application config from config.json
let this_url = window.location.href;
var main_config = JSON.parse(get_JSON(this_url + "/config.json"));

var tokens_config = main_config.tokens;
var addresses = [];
var wallet_tokens = [];
var to_tokens = [];
var from_tokens = [];
tokens_config.forEach(function(token) {
    addresses.push(token.addr);
    wallet_tokens.push({addr: token.addr.toString(), name: token.name.toString(), decimals: token.decimals, balance: "0"});
    to_tokens.push({addr: token.addr.toString(), name: token.name.toString(), decimals: token.decimals, balance: "0"});
    from_tokens.push({addr: token.addr.toString(), name: token.name.toString(), decimals: token.decimals, balance: "0"});
});

var unformatted_from_balances = {};
var unformatted_to_balances = {};

// Contract for which to populate balances for transfer
var contract_from_addr = main_config.contract_from_address;
const contract_from_ABI = main_config.contract_from_abi;

// Contract to
var contract_to_addr = main_config.contract_to_address;
const contract_to_ABI = main_config.contract_to_abi;

// Migration contract by Evan Bonsignori
const migration_tool_addr = main_config.contract_migration_address;
const migration_tool_abi = main_config.contract_migration_abi;

// generic ERC20 token ABI
const erc20_contract_abi = main_config.erc20_abi;
const eth_token_addr = main_config.etherium_address;


var web3 = new Web3(window.web3.currentProvider); // Get provider from Metamask
web3.eth.defaultAccount = window.web3.eth.defaultAccount;

// User address from metamask
var user_addr = web3.eth.defaultAccount;
console.log("User Address: " + user_addr);
if (typeof user_addr === "undefined") {
    console.log("Waiting on MetaMask...");
    wait();
}

var millisecondsToWait = 500;
function wait() {
    if (typeof window.web3.eth.defaultAccount !== "undefined") {
        console.log("Done waiting on MetaMask.");
        web3 = new Web3(window.web3.currentProvider);
        web3.eth.defaultAccount = window.web3.eth.defaultAccount;
        user_addr = web3.eth.defaultAccount;
        console.log("User Address: " + user_addr);
    } else {
        setTimeout(function() {
            wait();
        }, millisecondsToWait);
    }
}


// from contract instance
let from_contract_obj = web3.eth.contract(contract_from_ABI);
var from_contract = from_contract_obj.at(contract_from_addr);

// to contract instance
let to_contract_obj = web3.eth.contract(contract_to_ABI);
var to_contract = to_contract_obj.at(contract_to_addr);

// migration contract instance
let migration_tool_contract_obj = web3.eth.contract(migration_tool_abi);
var migration_tool_contract = migration_tool_contract_obj.at(migration_tool_addr);

// generic contract for fetching any ERC20-compliant contract's symbol (name)
var generic_contract = web3.eth.contract(erc20_contract_abi);
generic_contract.eth.defaultAccount = window.web3.eth.defaultAccount;


const amount_approved =  '1000000000000000000';

function deposit_ether() {
    console.log("Attempting to deposit Ether into ED-like contract...");
    // Put amount_approved ETH into FD contract
    from_contract.deposit({from: user_addr, value: amount_approved}, function (error, result) {
        if(!error) {
            console.log("Successful deposit of ETH with tx#: " + result.toString());
            from_contract.balanceOf(eth_token_addr, user_addr, function (error, result) {
                if (!error)
                    console.log("Previous balance of ETH in from contract: " + result.toString());
                else
                    console.error("Error: " + error);
            });
        }
        else
            console.error("Error: " + error);
    });
}

function deposit_sample_token(token_addr) {
    var tx_receipt;
    console.log(token_addr);

    // Token contract instance
    let token_contract = generic_contract.at(token_addr);

    // Put 1 of sampleToken into FD contract
    // Approve token transfer
    token_contract.approve(contract_from_addr, amount_approved, {from: user_addr}, function (error, result) {
        if(!error) {
            console.log("Approving token for transfer. tx#: " + result);
            tx_receipt = result;
            from_contract.depositToken(token_addr, amount_approved, {from: user_addr}, function (error, result) {
                if(!error) {
                    console.log("Depositing token balance in from contract. tx#: " + result.toString());
                    from_contract.balanceOf(token_addr, user_addr, function (error, result) {
                        if (!error)
                            console.log("Previous balance of token in from contract: " + result.toString());
                        else
                            console.error("Error unable to get token balance: " + error);
                    });
                }
                else
                    console.error("Error unable to deposit token into from contract: " + error);
            });
            // waitForApproveStatus();
        } else {
            console.log("Error transaction for token approval not sent: " + error);
        }
    });


    // Wait for results of transaction Token.approve
    // var approval_status;
    // function waitForApproveStatus(){
    //     web3.eth.getTransactionReceipt(tx_receipt, function(error, results) {
    //         if (!error) {
    //             if (results !== null) {
    //                 console.log("Transaction status is = " + results.status);
    //                 approval_status = results.status.toString();
    //             }
    //         } else {
    //             console.log("Error getting tx receipt" + error);
    //             approval_status = "-1";
    //         }
    //     });
    //
    //     if(approval_status === "0x1") {
    //         console.log("Token transfer approved!");
    //         // Deposit token if approved
    //         from_contract.depositToken(token_addr, amount_approved, {from: user_addr}, function (error, result) {
    //             if(!error) {
    //                 console.log("Depositing token balance in from contract. tx#: " + result.toString());
    //                 from_contract.balanceOf(token_addr, user_addr, function (error, result) {
    //                     if (!error)
    //                         console.log("Previous balance of token in from contract: " + result.toString());
    //                     else
    //                         console.error("Error unable to get token balance: " + error);
    //                 });
    //             }
    //             else
    //                 console.error("Error unable to deposit token into from contract: " + error);
    //         });
    //         approval_status = -1;
    //     } else if (approval_status === "0x0") {
    //         console.log("Token transfer not approved.");
    //         approval_status = -1;
    //     }
    //     else if (approval_status !== -1 || typeof approval_status !== "string") {
    //         console.log("Waiting for approval status from blockchain...");
    //         setTimeout(waitForApproveStatus, 5000);
    //     }
    // }
}


// Displaying Balances
class Balances extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wallet_balances: wallet_tokens,
            to_balances: to_tokens,
            from_balances: from_tokens,
        };
        this.refreshed = true;
    };

    refresh_balances() {
        this.refreshed = false;
        console.log("Refreshing balances");

        let new_wallet_balances = getWalletBalances();
        let new_to_balances = getToBalances();
        let new_from_balances = getFromBalances();


        Promise.all([new_wallet_balances, new_to_balances, new_from_balances]).then((resolved) => {
            this.refreshed = true;
            this.setState({
                wallet_balances: wallet_tokens,
                to_balances: to_tokens,
                from_balances: from_tokens,
            });
        });
    }

    populate_balances(balance_type) {
        if (this.refreshed) {
            var tokens = this.state.wallet_balances;
            if (balance_type === 'wallet') {
                tokens = this.state.wallet_balances;
            } else if (balance_type === 'to') {
                tokens = this.state.to_balances;
            } else {
                tokens = this.state.from_balances;
            }
            return tokens.map((token, index) => {
                return (
                    <tr key={token.addr + "_" + balance_type}>
                        <td>{token.name}</td>
                        <td>{token.balance}</td>
                    </tr>
                )
            });
        }
    }

    withdrawFrom() {
        let batch = web3.createBatch();
        // Populate batch with the multiple calls required for withdraw
        from_tokens.forEach(function(option) {
                let balance = unformatted_from_balances[option.addr];
                // ETH batch withdraw call
                if (option.addr === eth_token_addr) {
                    // Withdraw ETH balance to user wallet
                    batch.add(from_contract.withdraw(balance, {from: user_addr}, function(error, success) {
                        if (!error) {console.log("withdraw ETH tx#: " +success);}
                    }));
                    // ERC20 batch withdraw calls
                } else {
                    let token_contract = generic_contract.at(option.addr);
                    // Withdraw token to user wallet
                    batch.add(from_contract.withdrawToken(option.addr, balance, {from: user_addr}, function(error, success) {
                        if (!error) {console.log("withdraw token tx#: " +success);}
                    }));
                }
        });
        try {
            batch.execute();
        } catch (err) {

        }
    }

    withdrawTo() {
        let batch = web3.createBatch();
        // Populate batch with the multiple calls required for withdraw
        to_tokens.forEach(function(option) {
            let balance = unformatted_to_balances[option.addr];
            // ETH batch withdraw call
            if (option.addr === eth_token_addr) {
                // Withdraw ETH balance to user wallet
                batch.add(to_contract.withdraw(balance, {from: user_addr}, function(error, success) {
                    if (!error) {console.log("withdraw ETH tx#: " +success);}
                }));
                // ERC20 batch withdraw calls
            } else {
                let token_contract = generic_contract.at(option.addr);
                // Withdraw token to user wallet
                batch.add(to_contract.withdrawToken(option.addr, balance, {from: user_addr}, function(error, success) {
                    if (!error) {console.log("withdraw token tx#: " +success);}
                }));
            }
        });
        try {
            batch.execute();
        } catch (err) {

        }
    }

    render() {
        return (
            <div className="row">
                <span className="text-center">
                    <h1 >Balances</h1>
                    <p><em><a href="https://github.com/Ebonsignori/Ebonsignori.github.io/blob/master/README.md">Tutorial</a></em></p>
                </span>

                <div id="walletBalances" className="col-sm-11 col-md-4">
                    <h2 className="text-center">User Wallet</h2>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.populate_balances("wallet")}
                        </tbody>
                    </table>
                    <br />
                    <div className="text-center">
                        <button className="btn btn-default" onClick={() => this.refresh_balances()}>Refresh Balances</button>
                    </div>
                </div>
                <div id="fromBalances" className="col-sm-11 col-md-4">
                    <h2 className="text-center">From Contract</h2>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.populate_balances("from")}
                        </tbody>
                    </table>
                    <br />
                    <div className="text-center">
                        <button className="btn btn-default" onClick={this.withdrawFrom}>Withdraw All (To)</button>
                    </div>
                </div>
                <div id="toBalances" className="col-sm-11 col-md-4">
                    <h2 className="text-center">To Contract</h2>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.populate_balances("to")}
                        </tbody>
                    </table>
                    <br />
                    <div className="text-center">
                        <button className="btn btn-default" onClick={this.withdrawTo}>Withdraw All (From)</button>
                    </div>
                </div>
            </div>
        )
    }
}


async function getToBalances() {
    await new Promise((resolve, reject) => {migration_tool_contract.deltaBalances(contract_to_addr, user_addr, addresses, function(error, results) {
        if (!error) {
            for (let i = 0; i < to_tokens.length; i++) {
                // Handle Etherium balance separately
                if (to_tokens[i].addr === eth_token_addr) {
                    to_contract.balanceOf(eth_token_addr, user_addr, function(error, success) {
                        // let big_number = new BN(success['c'].join(''));
                        // let balance = big_number_to_decimal(big_number, 18);
                        to_tokens[i].balance = big_number_to_decimal(new BN(success.toString()), 18);
                        unformatted_to_balances[to_tokens[i].addr] = success;
                        resolve();
                    }) ;
                } else {
                    let balance_res = results[i];
                    // Format balance
                    let balance_bn = new BN(balance_res.toString());
                    let balance = big_number_to_decimal(balance_bn, to_tokens[i].decimals);
                    to_tokens[i].balance = balance.toString();
                    unformatted_to_balances[to_tokens[i].addr] = results[i];
                }
            }
        } else {
            console.log("Error fetching DEX balances from migration contract: Error: " + error);
            reject();
        }
    })});
}

async function getFromBalances() {
    await new Promise((resolve, reject) => {migration_tool_contract.deltaBalances(contract_from_addr, user_addr, addresses, {from: user_addr}, function(error, results) {
        if (!error) {
            for (let i = 0; i < from_tokens.length; i++) {
                if (from_tokens[i].addr === eth_token_addr) {
                    from_contract.balanceOf(eth_token_addr ,user_addr, function(error, success) {
                        // let big_number = new BN(success['c'].join(''));
                        // let balance = big_number_to_decimal(big_number, 18);
                        from_tokens[i].balance = big_number_to_decimal(new BN(success.toString()), 18);
                        unformatted_from_balances[from_tokens[i].addr] = success;
                        resolve();
                    }) ;
                } else {
                    let balance = results[i];
                    balance = new BN(balance.toString());
                    balance = big_number_to_decimal(balance, from_tokens[i].decimals);
                    from_tokens[i].balance = balance.toString();
                    unformatted_from_balances[from_tokens[i].addr] = results[i];
                }
            }
        } else {
            console.log("Error fetching DEX balances from migration contract: Error: " + error);
            reject();
        }
    })});
}

async function getWalletBalances() {
    await new Promise((resolve, reject) => {migration_tool_contract.walletBalances(user_addr, addresses, {from: user_addr}, function(error, results) {
        if (!error) {
            for (let i = 0; i < wallet_tokens.length; i++) {
                if (wallet_tokens[i].addr === eth_token_addr) {
                    web3.eth.getBalance(user_addr, function(error, success) {
                        if (!error) {
                            wallet_tokens[0].balance = big_number_to_decimal(new BN(success.toString()), 18);
                            resolve();
                        } else {
                            console.log("Error getting wallet balance for ETH..." +  error)
                        }
                    });
                } else {
                    let balance = results[i];
                    balance = new BN(balance.toString());
                    balance = big_number_to_decimal(balance, wallet_tokens[i].decimals);
                    wallet_tokens[i].balance = balance.toString();
                }
            }
        } else {
            console.log("Error fetching wallet balances from migration contract: Error: " + error);
            reject();
        }
    })});
}

// React component initialization for balances
var balancesComponent = ReactDOM.render(<Balances/>, document.getElementById('balances'));

$(window).load(function() {
    change_window(1);
    // Call refresh balances on window load
    balancesComponent.refresh_balances();
});



// button to open population tool
$('#populateTool').click(function(event) {
    document.getElementById('populationTool').style.display ='block';
});

// Change window state from outside of component (useful for when no user account or balances are present)
function change_window(state) {
    react_component.setState({window: state});
}

// fetches JSON from url
function get_JSON(url) {
    try {
        return $.ajax({
            url: url,
            async: false
        }).responseText;
    } catch (err) {
        console.log("Unable to fetch JSON");
        alert("Error fetching JSON, please contact site administrator");
    }
}

// converts the big number stored in eth contracts to its user-friendly decimal equivalent
function big_number_to_decimal(big_number, token_decimals) {
    return big_number.dividedBy(Math.pow(10, token_decimals)).toString();
}