require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {

        development: {
            host: "localhost",
            port: 8545,
            network_id: "5777"
        },

        live: {
            network_id: 1,
            host: "localhost",
            port: 8545,
            //from: "", // default address to use for any transaction Truffle makes during migrations
            gas: 5000000, // Gas limit used for deployments
            gasPrice: 20000000000  //20 Gwei
        },

        rinkeby: {
            host: "localhost", // Connect to geth on the specified
            port: 8545,
            from: "0x471b488c328631833d212d528c8f6c599a43888d", // your address
            network_id: 4, //Rinkeby network id
            gas: 4612388 // Gas limit used for deploys
        }

    },

    mocha: {
        useColors: true,
        slow: 5000
    }
};
