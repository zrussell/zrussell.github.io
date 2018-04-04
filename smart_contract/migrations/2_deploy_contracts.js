var EtherDelta = artifacts.require("./EtherDelta.sol");
var ForkDelta = artifacts.require("./ForkDelta.sol");
var MigrationUtility = artifacts.require("./MigrationUtility.sol");
var LSafeMath = artifacts.require("./LSafeMath.sol");

var SampleToken1 = artifacts.require("./SampleToken.sol");
var AnotherSampleToken = artifacts.require("./AnotherSampleToken.sol");
var TwelveDecimals = artifacts.require("./TwelveDecimals.sol");
var Coin = artifacts.require("./Coin.sol");

module.exports = function(deployer, network, accounts) {
  
  if (network === "develop" || network === "development") {
    admin = accounts[1];
    feeAccount = accounts[2];
    feeMake = 0;
    feeTake = 3000000000000000;
    freeUntilDate= 0;
  }
  
  if (network === "live" || network === "production" || network === "rinkeby") {
    //TODO: set admin and fee accounts for production
    admin = '0x471b488c328631833d212d528c8f6c599a43888d'; // Rinkeby Testnet Account
    feeAccount = '0x471b488c328631833d212d528c8f6c599a43888d';
    feeMake = 0;
    feeTake = 3000000000000000;
    freeUntilDate= 0;
  }

// // Link safemath to ForkDelta
// deployer.deploy(LSafeMath);
// deployer.link(LSafeMath, ForkDelta);
// // Deploy ForkDelta and EtherDelta contracts
// deployer.deploy(ForkDelta, admin, feeAccount, feeTake, freeUntilDate, '0x0000000000000000000000000000000000000000');
// deployer.deploy(EtherDelta, admin, feeAccount, '0x0000000000000000000000000000000000000000', feeMake, feeTake, 0);

// Deploy MigrationUtility contract
deployer.deploy(MigrationUtility, admin, feeTake);

// Deploy sample tokens
// deployer.deploy(SampleToken1, admin, 100000000*1000000000000000000 , "SampleToken", 18, "SMPL");
// deployer.deploy(AnotherSampleToken, admin, 100000000*1000000000000000000 , "AnotherSampleToken", 18, "SMPL2");
// deployer.deploy(TwelveDecimals, admin, 100000000*1000000000000000000 , "TwelveDecimals", 12, "TWLD");
// deployer.deploy(Coin, admin, 100000000*1000000000000000000 , "Coin", 6, "COIN");
};

