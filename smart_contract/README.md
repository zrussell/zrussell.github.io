# Testing Smart Contracts
This tutorial contains tutorials for putting the EtherDelta and ForkDelta contracts
on a local and remote server for testing purposes.

## Test Remotely With Rinkeby Testnet
The contracts in the [contracts](./contracts) directory are already deployed
to the Rinkeby network by the public key:
 0xb9117fbbc2692aa305187267a97f3c0c9ed85471 [@Ebonsignori's Account](http://github.com/ebonsignori)
This key is the admin account for both the EtherDelta and ForkDelta Smart contracts.
If you wish to use this account to interact with the smart contracts, contact Evan to
get the accounts private key.

Alternatively, you can deploy the contracts on the Rinkeby network yourself.
An in depth tutorial will be created eventually, but the short version is as follows:

- Set up local Rinkeby Network
- Mine node in Terminal with
    ```
    geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal
    ```
- Unlock your rinkeby account using the provided unlock_rinkeby_account.js using the following command
    ```
    node ./unlock_rinkeby_account 99999
    ```
    Where 99999 is the number of seconds to unlock your account.
    **Make sure to replace the account public and private key in the unlock_rinkeby_account.js with your information**
- Change current pub key everywhere that it appears in truffle.js with your own
- Run
    ```
    truffle migrate --network rinkeby --reset
    ```
    To push contracts to rinkeby network from your pub key
- Copy all contract addresses and inspect them at https://rinkeby.etherscan.io/


## Develop Locally with Ganache
### Setting up a development environment
Requirements:
* Node.js (https://nodejs.org/en/)
* git client (https://git-scm.com/download/)

Setup:
1. Install truffle: `npm install -g truffle`
2. On Windows install the necessary build tools: `npm install --global --production windows-build-tools`
3. Install Ganache from: http://truffleframework.com/ganache/
4. Clone the repo: git clone https://github.com/forkdelta/smart_contract.git
5. Change into the root directory: `cd smart_contract`
6. Install all node.js requirements from package.json: `npm install`
7. If you use VSCode, copy `.vscode\settings.json.default` to `.vscode\settings.json` for a reasonable solhint linter configuration

### Migrating and testing with Ganache
* Start ganache
* Compile: `truffle compile`
* Migrate: `truffle migrate`
* Run test cases: `truffle test`

### Migrating and testing with truffle develop
* `truffle develop`
* Compile: `compile`
* Migrate: `migrate`
* Run test cases: `test`

### Migrating to the live/production chain
* Edit "live" section in `truffle.js`:
* Set reasonable gas price based on https://ethgasstation.info
* Start local ethereum node (geth/parity) and set connection parameters in `truffle.js` 
* Set/verify creation parameter for ForkDelta contract in `./migrations/2_deploy_contracts_js`  
* Unlock account in geth/parity that is used for deploying the contract (first account or the one specified with "from" in `truffle.js`)
* `truffle migrate -network=live`