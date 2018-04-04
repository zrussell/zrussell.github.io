const my_rinkeby_pubkey = '0x471b488c328631833d212d528c8f6c599a43888d';
const my_rinkeby_private_key = 'wgXuN3wfcCZ6ypj2X87wxLRqHRPczn';

const Web3 = require('web3');

// Unlock account logic
var unlock_duration_sec = parseInt(process.argv[2]);
var rpc_api_provider = "http://127.0.0.1:8545";

var web3 = new Web3(new Web3.providers.HttpProvider(rpc_api_provider));

web3.personal.unlockAccount(my_rinkeby_pubkey, my_rinkeby_private_key, unlock_duration_sec);



// Send tokens to user address logic
var user_to_address = '0xb9117fbbc2692aa305187267a97f3c0c9ed85471'; // A seperate rinkeby addess

var fs = require('fs');
var main_config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

web3.eth.defaultAccount = my_rinkeby_pubkey;

// Variables from json
var contract_from_addr = main_config.contract_from_address;
const contract_from_ABI = main_config.contract_from_abi;

var contract_to_addr = main_config.contract_to_address;
const contract_to_ABI = main_config.contract_to_abi;

const migration_tool_addr = main_config.contract_migration_address;
const migration_tool_abi = main_config.contract_migration_abi;

const erc20_contract_abi = main_config.erc20_abi;
const eth_token_addr = main_config.etherium_address;

// instances of contracts
let from_contract_obj = web3.eth.contract(contract_from_ABI);
var from_contract = from_contract_obj.at(contract_from_addr);

let to_contract_obj = web3.eth.contract(contract_to_ABI);
var to_contract = to_contract_obj.at(contract_to_addr);

let migration_tool_contract_obj = web3.eth.contract(migration_tool_abi);
var migration_tool_contract = migration_tool_contract_obj.at(migration_tool_addr);

var generic_contract_obj = web3.eth.contract(erc20_contract_abi);


var amount_approved = 1000000000000000000;

// Send each token in config file to user_addr
for (var i = 0; i < main_config.tokens.length; i++) {
    // Token address
    let token_addr = main_config.tokens[i].addr;
    // Instance of token
    let generic_contract = generic_contract_obj.at(token_addr);
    // Get balance of my_rinkeby_pubkey
    console.log("Balance of token : " + token_addr);
    console.log(generic_contract.balanceOf(my_rinkeby_pubkey).toString());
    console.log(); // newline

    // Approve and transfer token_addr from my_rinkeby_pubkey to user_addr
    generic_contract.approve(my_rinkeby_pubkey, amount_approved, {from: my_rinkeby_pubkey}, function(error, success) {
        if (!error) {
            generic_contract.transfer(user_to_address, amount_approved, {from: my_rinkeby_pubkey}, function(error, success) {
                console.log("Successfully transfered " + amount_approved + " to " + user_to_address);
                console.log("From " + my_rinkeby_pubkey + " of token: " + token_addr);
                console.log(); // Newline
            });
        } else {
            console.log(error);
        }
    });
}