# TechFest DEX Migration Tool
The TechFest DEX Migration Tool is purely for demonstration and testing, and runs on the Rinkeby testnet rather than the Etherium network. 

When following these instructions and working with the DEX tool or any dApp (_decentralized application_), keep in mind that transactions need to be verified by the network and then mined to be updated. Have patience between each step, and press the "refresh balances" button in the DEX Migration Tool every 5-10 seconds after submitting a transaction. 

## Using the DEX Migration Tool
- Make sure that you have [MetaMask installed](https://metamask.io/)
- Switch MetaMask Main Network to Rinkeby Network and Create an Account
- Open [DEX Migration Tool](https://ebonsignori.github.io/)
- Hard reload the page and make sure you're logged on with MetaMask extension
- Read the instructions in Request Tokens Utility to get ETH and the four supported coins in your MetaMask account's wallet.
- Deposit some tokens into the _From Contract_ using the Population Utility
- Refresh  balances until the balances are updated with the balances you added
- Open Migrate Utility and choose balances to migrate to the _To Contract_

# Old README Contents
# Migration Tool
We need a way to transfer users off of the current [ED smart-contract](https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819) (_EDSC_) to the [FD smart-contract](https://github.com/forkdelta/smart_contract) (_FDSC_) that is in development. The migration tool seeks to solve this need by forcing an overlay popup window when users first visit [ForkDelta](https://forkdelta.github.io/).

Rather than making a standalone migration utility, this utility is built on top of the [existing frontend](https://github.com/forkdelta/forkdelta.github.io). This introduces the migration to users from our trusted site and pushes them to migrate before we discontinue support of the _EDSC_ (date of or if we discontinue TBD). 

## Development Environment 
Rather than using a standalone utility, the migration tool is built into the FD front-end. This means dealing with the gigantic main.js file ripped from the old ED site. Rather than reverse engineering the built main.js, I've compartmentalized the tool into its own directory with its own JS and Styling files. 

Since we have to use backend node packages to call the Etherium block-chain and ForkDelta's API (web3.js and socket.io.js respectively), I'm using [browserify.js](http://browserify.org/) to build a front-end JS file consisting of backend node libraries. The script to quickly perform this build is found in the package.json file in the root of the migration tool directory. package.json contains the metadata of the project and should always be added to the repo.

### Front-End JS with browserify 
`npm run-script bundle-js` builds [migrate.js](./migrate.js) into [migrate_bundle.js](./migrate_bundle.js) using browserify. This allows for node modules to be processed with front-end JS. 

If the script gives you errors, try npm install browserify with the -g global flag to add browserify as a global CLI utility. 

Bundle script as found in package.json
```
browserify migrate.js -o migrate_bundle.js
```

### Dependency Management
Dependencies are found in the package.json file. If a dependency is added that is used in production, 
use the `--save` flag, otherwise use the `--save-dev` flag. 

Production 
```$xslt
npm install <package_name> --save
```

Development
```$xslt
npm install <package_name> --save-dev
```
