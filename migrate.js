"use strict";
//================================================================================
// Node.js dependencies
//================================================================================
const Web3 = require('web3');
const BN = require('bignumber.js');
// FORORDERS : Everything with this label is for adding order transfer features to the migration tool
// const io = require('socket.io-client');

// React
import React from 'react';
import ReactDOM from 'react-dom';


// try {
//     var tokens_JSON = JSON.parse(get_JSON('https://raw.githubusercontent.com/forkdelta/forkdelta.github.io/master/config/main.json')).tokens;
// } catch (err) {
//     alert("Error fetching tokens from https://raw.githubusercontent.com/forkdelta/forkdelta.github.io/master/config/main.json. " +
//         "\n Please contact site administrator.");
//     console.log(err);
// }


import BalancesWindow from './components/windows/BalancesWindow'
import ConfirmationWindow from './components/windows/ConfirmationWindow'
import IntroductionWindow from './components/windows/IntroductionWindow'
import LoadingWindow from './components/windows/LoadingWindow'
import NoAccountWindow from './components/windows/NoAccountWindow'
import NoBalancesWindow from './components/windows/NoBalancesWindow'
// import OrdersWindow from './components/windows/OrdersWindow'
import SuccessWindow from './components/windows/SuccessWindow'

// Parent React component that controls window state
class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Initialize window to 0 (loading window)
            window: 0,

            user_address: '',

            balances_fetched: false,

            // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
            // order_fetched_progress: 0,
            // order_fetches_needed: 0,

            balances_options: [],

            // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
            // orders_buy_options: [],
            // orders_sell_options: [],

            estimated_gas: 0
        };

        this.refreshed = true;

        // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
        // Bind socket handler function
        // this.handle_order_fetch = this.handle_order_fetch.bind(this);

        // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
        // -- init socket.io for fetching orders --
        // const socket_addr = "https://api.forkdelta.com";
        // this.FD = io.connect(socket_addr, {
        //     transports: ['websocket'],
        // });
        //
        // this.FD.on('connect', function(data) { console.log('connected to FD api'); });
        // this.FD.on('disconnect', function(data) { console.log('disconnected from FD api'); });
        //
        // // Listen for market response and update buy and sells if there is one
        // this.FD.on('market', this.handle_order_fetch);
    };

    /* --- Navigate to next window -- */
    nextWindow() {
        let current_window = this.state.window;
        if (current_window < 3) {
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
        document.getElementById('migrationTool').style.display = 'none';
    }

    /* --- Add user-entered token to selected list --- */
    add_token(event) {
        event.preventDefault();

        // Get token address from DOM to let form submit go through validation rather than using onChange on input form
        let token_address = $('#new-token-addr-input').val();
        console.log("Fetching details for user entered-token: " + token_address);

        // Check that token isn't already being displayed
        let already_displayed = false;
        this.state.balances_options.forEach(function (balance) {
            if (balance.addr === token_address) {
                alert("Token balance is already listed.");
                already_displayed = true;
            }
        });

        // Add token to selected and tokens_added in state for updating React component
        if (!already_displayed) {
            let name = get_token_symbol(token_address);
            if (name === "Name Error") // If unable to fetch name from generic Web3 call, use token address
                name = token_address;
            let balance = get_token_balance(token_address, this.state.user_address);

            let balances_updated = this.state.balances_options.concat(
                {addr: token_address, name: name, balance: balance, is_selected: true}
            );
            this.setState({
                balances_options: balances_updated,
            });
        }
    }

    refresh_balances() {
        this.refreshed = false;

        let balances_promise = fetch_balances(user_address, token_addresses, contract_from_addr);

        balances_promise.then((resolved) => {
            this.refreshed = true;
            this.setState({
                balances_options: balances_options,
                balances_fetched: true
            });
        });
    }

    /* --- One time populate of balances_options with fetched balances from out code --- */
    // fetch_user_balances_and_orders() {
    //     // Fetch user address
    //     this.get_user_address();
    //
    //     // Check that balances are only fetched once
    //     if (!this.state.balances_fetched) {
    //         let temp_addresses = get_balances_options();
    //         // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    //         // let order_fetches_needed = temp_addresses.length;
    //         this.setState({
    //             balances_options: temp_addresses,
    //             balances_fetched: true,
    //             // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    //             // order_fetches_needed: order_fetches_needed
    //         });
    //
    //         // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    //         // Fetch orders
    //         // let user_addr = this.state.user_address.toString();
    //         // let FD = this.FD;
    //         // this.state.balances_options.forEach(function(balance) {
    //         //     // Emit getMarket API call to FD socket to get user orders
    //         //     FD.emit('getMarket', {token: balance.addr, user: user_addr});
    //         // });
    //
    //     }
    // }

    /* TODO: Takes too long loop through all supported tokens
    * Current Method: loops though the tokens for which user has balances and checks for orders
    * Solution Ideas:
    * 1. Change API to give all orders for a given user, so that only user can be
    * passed to the API instead of user + token (has to be both or neither, API docs should
    * update this, because current explanation isn't clear on this
    *
    * 2. Prompt user to enter token address of any orders that are missing
     */

    // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    // handle_order_fetch(data) {
    //     console.log('Returned market from ForkDelta API');
    //
    //     if (data.hasOwnProperty('myOrders')) {
    //         //add sell orders
    //         let sells = [];
    //         if (data.myOrders.hasOwnProperty('sells')) {
    //             data.myOrders.sells.forEach(function(val){
    //                 // Order selected for migration by default
    //                 val['is_selected'] = true;
    //                 // Get token symbols for displaying orders
    //                 val['tokenGetName'] = get_token_symbol(val.tokenGet);
    //                 val['tokenGiveName'] = get_token_symbol(val.tokenGive);
    //                 sells.push(val);
    //             });
    //         }
    //
    //         //add buy orders
    //         let buys = [];
    //         if (data.myOrders.hasOwnProperty('buys')) {
    //             data.myOrders.buys.forEach(function(val){
    //                 // Order selected for migration by default
    //                 val['is_selected'] = true;
    //                 // Get token symbols for displaying orders
    //                 val['tokenGetName'] = get_token_symbol(val.tokenGet);
    //                 val['tokenGiveName'] = get_token_symbol(val.tokenGive);
    //                 buys.push(val);
    //             });
    //         }
    //
    //         let new_sells = this.state.orders_sell_options.concat(sells);
    //         let new_buys = this.state.orders_sell_options.concat(buys);
    //         let incremented_fetched = this.state.order_fetched_progress + 1;
    //
    //         this.setState({
    //             orders_sell_options: new_sells,
    //             orders_buy_options: new_buys,
    //             order_fetched_progress: incremented_fetched
    //         });
    //
    //     }
    // }

    get_user_address() {
        let user_address_temp = get_user_address();
        this.setState({
            user_address: user_address_temp
        })
    }

    // Toggle balance selected
    on_balance_select(index) {
        let balances_updated = this.state.balances_options;
        balances_updated[index].is_selected = !balances_updated[index].is_selected;
        this.setState({balances_options: balances_updated});
    }

    // Select all balances
    select_all_balances() {
        let balances_updated = this.state.balances_options;
        for (let i = 0; i < balances_updated.length; i++) {
            if (!balances_updated[i].is_selected) {
                balances_updated[i].is_selected = true;
            }
        }
        this.setState({balances_options: balances_updated});
    }

    // Deselect all balances
    deselect_all_balances() {
        let balances_updated = this.state.balances_options;
        for (let i = 0; i < balances_updated.length; i++) {
            if (balances_updated[i].is_selected) {
                balances_updated[i].is_selected = false;
            }
        }
        this.setState({balances_options: balances_updated});
    }

    // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    // Toggle sell order selected
    // on_order_sell_select(index) {
    //     let sells_updated = this.state.orders_sell_options;
    //     sells_updated[index].is_selected = !sells_updated[index].is_selected;
    //     this.setState({orders_sell_options: sells_updated});
    // }

    // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
    // Toggle buy order selected
    // on_order_buy_select(index) {
    //     let buys_updated = this.state.orders_buy_options;
    //     buys_updated[index].is_selected = !buys_updated[index].is_selected;
    //     this.setState({orders_buy_options: buys_updated});
    // }

    // TODO: Estimate gas. Would it be better to create helper / utility contract that migrates everything?
    estimate_gas() {
        console.log("Estimating Gas Cost...");
        // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
        // let all_options = this.state.balances_options.concat(this.state.orders_buy_options)
        //                                              .concat(this.state.orders_sell_options);
        let tokens_for_transfer = [];
        let all_options = this.state.balances_options;
        all_options.forEach(function(option) {
            if (option.is_selected){
                tokens_for_transfer.push(option.addr);
            }
        });

        migration_tool_contract.transferEDtoFDBalances.estimateGas(contract_from_addr, contract_to_addr, user_address, tokens_for_transfer, function(error, success) {
            if (!error) {
                console.log(success)
            } else {
                console.log("Error estimating gas cost of migration..." + error);
            }
        })

    }

    // TODO: contract migration logic. Helper / utility contract?
    begin_migration() {
        console.log("Beginning Migration...");

        let batch = web3.createBatch();
        let tokens_options = this.state.balances_options;
        // Populate batch with the multiple calls required for migration
        tokens_options.forEach(function(option) {
            // Only migrate tokens selected by user
            if (option.is_selected){
                let balance = unformatted_balances[option.addr];
                // Eth batch migrate calls
                if (option.addr === etherium_addr) {
                    // Withdraw ETH balance to user wallet
                    batch.add(from_contract.withdraw(balance, {from: user_address}, function(error, success) {
                        if (!error) {console.log("withdraw ETH tx#: " +success);}
                    }));
                    // Deposit ETH balance to user wallet
                    batch.add(to_contract.deposit({from: user_address, value: balance}, function(error, success) {
                        if (!error) {console.log("deposit ETH tx#: " +success);}
                    }));
                    // ERC20 batch migrate calls
                } else {
                    let token_contract = generic_contract.at(option.addr);
                    // Withdraw token to user wallet
                    batch.add(from_contract.withdrawToken(option.addr, balance, {from: user_address}, function(error, success) {
                        if (!error) {console.log("withdraw token tx#: " +success);}
                    }));
                    // Approve token transfer to new contract
                    batch.add(token_contract.approve(contract_to_addr, balance, {from: user_address}, function(error, success) {
                        if (!error) {
                            console.log("approve of token transfer tx#: " +success);
                            // Deposit token in new contract (contractTo)
                            batch.add(to_contract.depositToken(option.addr, balance, {from: user_address}, function(error, success) {
                                if (!error) {console.log("deposit token tx#: " +success)}
                            }));
                        }
                    }));
                }
            }
        });
        try {
            batch.execute();
        } catch (err) {

        }
    }

    render() {
        // Determine current window
        let current_window;
        if (this.refreshed === false) {
            current_window = <LoadingWindow/>;
        } else {
            switch (this.state.window) {
                case -2:
                    current_window = <NoAccountWindow closeWindow={() => this.closeWindow()}/>;
                    break;
                case -1:
                    current_window = <NoBalancesWindow closeWindow={() => this.closeWindow()}/>;
                    break;
                case 0:
                    current_window = <LoadingWindow/>;
                    break;
                case 1:
                    current_window = <IntroductionWindow nextWindow={() => this.nextWindow()}
                                                         closeWindow={() => this.closeWindow()}
                                                         get_user_address={() => this.get_user_address()}
                                                         user_address={this.state.user_address}/>;
                    break;
                case 2:
                    current_window = <BalancesWindow nextWindow={() => this.nextWindow()}
                                                     previousWindow={() => this.previousWindow()}
                                                     closeWindow={() => this.closeWindow()}
                                                     balances_options={this.state.balances_options}
                                                     balances_selected={this.state.balances_selected}
                                                     onBalanceSelect={index => this.on_balance_select(index)}
                                                     handleTokenAdd={(e) => this.add_token(e)}
                                                     selectAllBalances={() => this.select_all_balances()}
                                                     deselectAllBalances={() => this.deselect_all_balances()}/>;
                    break;
                // FORORDERS : Everything with this label is for adding order transfer features to the migration tool
                // case 3:
                //     current_window = <OrdersWindow nextWindow={() => this.nextWindow()}
                //                                    previousWindow={() => this.previousWindow()}
                //                                    orders_buy_options={this.state.orders_buy_options}
                //                                    orders_sell_options={this.state.orders_sell_options}
                //                                    onSellSelect={index => this.on_order_sell_select(index)}
                //                                    onBuySelect={index => this.on_order_buy_select(index)}/>;
                //     break;
                // case 3:
                //     current_window = <ConfirmationWindow nextWindow={() => this.nextWindow()}
                //                                          previousWindow={() => this.previousWindow()}
                //                                          closeWindow={() => this.closeWindow()}
                //                                          estimateGas={() => this.estimate_gas()}
                //                                          estimated_gas={this.state.estimated_gas}/>;
                //     break;
                case 3:
                    current_window = <SuccessWindow closeWindow={() => this.closeWindow()}
                                                    previousWindow={() => this.previousWindow()}
                                                    begin_migration={() => this.begin_migration()}/>;
                    break;
            }
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


// React component initialization for front-end of migration tool
var react_component = ReactDOM.render(<Application/>, document.getElementById('migrationTool'));
$(document).ready(function() {
    // Get balances on load
    react_component.refresh_balances();
    change_window(1);
});

// ==================================================
// Config Variables
//================================================================================
// TODO: Update to Github-hosted config.json
var main_config = JSON.parse(get_JSON("http://127.0.0.1:8080/config.json"));

var etherium_addr = main_config.etherium_address;

var contract_from_addr = main_config.contract_from_address;
const contract_from_ABI = main_config.contract_from_abi;
// Contract to transfer balances to
var contract_to_addr = main_config.contract_to_address;
const contract_to_ABI = main_config.contract_to_abi;
// Migration contract by Evan Bonsignori
const migration_tool_addr = main_config.contract_migration_address;
const migration_tool_abi = main_config.contract_migration_abi;

// generic abi for fetching symbol from any ERC20 token
const erc20_contract_abi = main_config.erc20_abi;

// get tokens from frontend config JSON and populate token_addresses with addresses
var tokens_JSON = main_config.tokens;

// populate token info arrays from JSON
var token_addresses = [];
var token_names = [];
var token_decimals = [];
tokens_JSON.forEach(function (token) {
    token_addresses.push(token['addr']);
    token_names.push(token['name']);
    token_decimals.push(token['decimals']);
});
var token_addresses_with_balances = [];


var web3 = new Web3(window.web3.currentProvider); // Get provider from Metamask
web3.eth.defaultAccount = window.web3.eth.defaultAccount;

// User address from metamask
var user_address = web3.eth.defaultAccount;
if (typeof user_address === "undefined") {
    wait();
}

var millisecondsToWait = 500;
function wait() {
    if (typeof window.web3.eth.defaultAccount !== "undefined") {
        web3 = new Web3(window.web3.currentProvider);
        web3.eth.defaultAccount = window.web3.eth.defaultAccount;
        user_address = web3.eth.defaultAccount;
    } else {
        setTimeout(function() {
            wait();
        }, millisecondsToWait);
    }
}

// migration contract instance
let migration_tool_contract_obj = web3.eth.contract(migration_tool_abi);
var migration_tool_contract = migration_tool_contract_obj.at(migration_tool_addr);

// from contract instance
let from_contract_obj = web3.eth.contract(contract_from_ABI);
var from_contract = from_contract_obj.at(contract_from_addr);

//to contract instance
let to_contract_obj = web3.eth.contract(contract_to_ABI);
var to_contract = to_contract_obj.at(contract_to_addr);

// generic contract for fetching any ERC20-compliant contract's symbol (name)
var generic_contract = web3.eth.contract(erc20_contract_abi);


// balances and arrays containing options to be displayed in ms
var balances = {};
var balances_options = []; // Non-zero balances to be displayed as options for migration
var unformatted_balances = [];

// Front-end event listeners
// nav-bar link to open migration tool
$('#migrateTool').click(function(event) {
    document.getElementById('migrationTool').style.display ='block';
});


async function fetch_balances(user, token_addresses, contract_addr) {
    await new Promise((resolve, reject) => {migration_tool_contract.deltaBalances(contract_addr, user, token_addresses, function(error, results) {
        if (!error) {
            console.log("Balances fetched from ED-like contract at : " + contract_from_addr);
             // Empty previous balances
            token_addresses_with_balances = [];
            balances_options = [];

            let addr_index = 0;
            results.forEach(function (balance) {
                // get big number from balance string returned from contract call
                let big_number_str = balance['c'];
                // if balances are a split integer, join it into single value
                let big_number = new BN(big_number_str.join(''));
                // Only tokens with non-zero balances are added to balances
                if (big_number.toString() !== "0") {
                    // add balance to balances in big-number form (where decimal is = 0)
                    balances[token_addresses[addr_index]] = big_number;
                    unformatted_balances[token_addresses[addr_index]] = balance;
                    token_addresses_with_balances.push(token_addresses[addr_index]);
                }
                addr_index++;
            });

            // Populate non-zero options for front-end user to select
            token_addresses_with_balances.forEach(function (token_addr) {
                let name = get_token_symbol(token_addr);
                let balance = get_token_balance(token_addr, user);
                balances_options.push({"addr": token_addr, "name": name, "balance": balance, "is_selected": true});
            });
            resolve();
        } else {
            console.log("Error fetching balances for migration tool... " + error);
            reject();
        }
    })});
}

//--- utils ---
// get user's current account from redux store after the store loads
async function fetch_user_addr() {
    if (typeof(window.main.EtherDelta.store.getState().user.accounts[window.main.EtherDelta.store.getState().user.selectedAccount]) !== "undefined") {
        let user_from_store = window.main.EtherDelta.store.getState().user;
        return user_from_store.accounts[user_from_store.selectedAccount].addr;
    } else {
        console.log("Waiting on store to populate user address, or for user to select an account...");
        await sleep(5000);
        if (typeof(window.main.EtherDelta.store.getState().user.accounts[window.main.EtherDelta.store.getState().user.selectedAccount]) === "undefined") {
            // Change window to NoAccountWindow
            change_window(-2);
        }
        return fetch_user_addr();
    }
}

// converts the big number stored in eth contracts to its user-friendly decimal equivalent
function big_number_to_decimal(big_number, token_decimals) {
    return big_number.dividedBy(Math.pow(10, token_decimals)).toString();
}

// gets a token's symbol using a generic contract ABI
function get_token_symbol(token_address) {
    // If Ether, return ETH address
    if (token_address === etherium_addr) {
        return "ETH";
    }

    // Search tokens for addr to see if token address is already supported in FD config
    let addr_index = token_addresses.indexOf(token_address);
    if (addr_index !== -1) {
        return token_names[addr_index];
    }

     // If not supported, lookup symbol with web3 call
    try {
        let token_contract = generic_contract.at(token_address);
        return token_contract.symbol().toString();
    } catch (err) {
        console.log("Error in migrate.js with function get_token_symbol");
        alert("Error fetching token name. Is the token ERC20 compliant?");
        console.log(err);
        return "Name Error";
    }

}

// gets a token's decimals from Etherium call
function get_token_decimals(token_address) {
    // If Ether, return ETH decimals
    if (token_address === etherium_addr) {
        return 18;
    }

    // Search tokens for addr to see if token address is already supported in FD config
    let addr_index = token_addresses.indexOf(token_address);
    if (addr_index !== -1) {
        return token_decimals[addr_index];
    }

    // If not supported, lookup decimals with web3 call
    try {
        let decimalsCall = {
            to: token_address,
            data: web3.sha3('decimals()').substring(0, 10)
        };
        // Parse returned hex into integer
        return parseInt(web3.eth.call(decimalsCall));
    } catch (err) {
        console.log("Error in migrate.js with function get_token_decimals");
        alert("Error fetching token decimals. Is the token ERC20 compliant?");
        return "0";
    }


}

// gets an individual token's balance with a web3 call
function get_token_balance(token_address, user) {
    // Check to see if balance is already retrieved through smart contract call
    try {
    if (balances[token_address] > 0) {
        return big_number_to_decimal(balances[token_address], get_token_decimals(token_address));
    }
        // grab balance from from_contract contract
        let big_number_str = from_contract.balanceOf(token_address, user)['c'];
        // if balances return a split integer, join it into single value
        let big_number = new BN(big_number_str.join(''));
        // return balance in user-readable decimal notation
        return big_number_to_decimal(big_number, get_token_decimals(token_address));
    } catch (err) {
        console.log("Error in migrate.js with function get_token_balance");
        alert("Error fetching user's token balance");
        console.log(err);
        return "Error";
    }
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

// sleeps for passed milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Change window state from outside of component (useful for when no user account or balances are present)
function change_window(state) {
    react_component.setState({window: state});
}

// Returns user address to React scope
function get_user_address() {
    return user_address;
}

// Returns balance options to React scope
function get_balances_options() {
    return balances_options;
}

// Detect MetaMask Account change
// var account = web3.eth.accounts[0];
// var accountInterval = setInterval(function() {
//     if (web3.eth.accounts[0] !== account) {
//         account = web3.eth.accounts[0];
//         updateInterface();
//     }
// }, 100);
// function updateInterface() {
// }