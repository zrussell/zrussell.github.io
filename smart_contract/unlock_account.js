const my_rinkeby_pubkey = '0x471b488c328631833d212d528c8f6c599a43888d';
const my_rinkeby_private_key = 'wgXuN3wfcCZ6ypj2X87wxLRqHRPczn';

const Web3 = require('web3');

// Unlock account logic
var unlock_duration_sec = parseInt(process.argv[2]);
var rpc_api_provider = "http://127.0.0.1:8545";

var web3 = new Web3(new Web3.providers.HttpProvider(rpc_api_provider));

web3.personal.unlockAccount(my_rinkeby_pubkey, my_rinkeby_private_key, unlock_duration_sec);

