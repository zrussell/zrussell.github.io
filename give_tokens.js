import React from "react";
import ReactDOM from "react-dom";

const Web3 = require('web3');

function get_tokens() {
    console.log("Beginning Transfer");
    const my_rinkeby_pubkey = '0x471b488c328631833d212d528c8f6c599a43888d';
    const my_rinkeby_private_key = 'wgXuN3wfcCZ6ypj2X87wxLRqHRPczn';

    // Unlock account duration
    var unlock_duration_sec = 9999;

    // User address from metamask that tokens will be sent to
    var user_to_address = window.web3.eth.defaultAccount;

    // let rpc_api_provider = 'https://rinkeby.infura.io/ASIXTY7yKBgobbegOCsj';
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    // Unlock account with tokens
    web3.personal.unlockAccount(my_rinkeby_pubkey, my_rinkeby_private_key, unlock_duration_sec, {from: my_rinkeby_pubkey}, function(error, success) {
        if (!error) {
            console.log("Rinkeby account unlocked: " + success);
        } else {
            console.log("Unable to unlock Rinkeby account." + error);
        }
    });

    // Get config from config.json
    let this_url = window.location.href;
    var main_config = JSON.parse(get_JSON(this_url + "/config.json"));
    // Variables from json
    const erc20_contract_abi = main_config.erc20_abi;

    // instance of generic ERC20 contract
    var generic_contract_obj = web3.eth.contract(erc20_contract_abi);

    // Sends 1 Ether unit to user
    var amount_approved = 1000000000000000000;

    console.log("Sending to addr:" + user_to_address);
    console.log("Sending from addr:" + my_rinkeby_pubkey);

    // Send each token in config file to user_addr
    for (var i = 0; i < main_config.tokens.length; i++) {
        // Token address
        let token_addr = main_config.tokens[i].addr;
        // Instance of token
        let generic_contract = generic_contract_obj.at(token_addr);

        // Approve and transfer token_addr from my_rinkeby_pubkey to user_addr
        generic_contract.approve(my_rinkeby_pubkey, amount_approved, {from: my_rinkeby_pubkey}, function(error, success) {
            if (!error) {
                generic_contract.transfer(user_to_address, amount_approved, {from: my_rinkeby_pubkey}, function(error, success) {
                    console.log("Successfully transferred " + amount_approved + " of token " + token_addr +
                        " to " + user_to_address + " from " + my_rinkeby_pubkey);
                    console.log(); // Newline
                });
            } else {
                console.log("Error transferring token... " + error);
            }
        });
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

// Window for instructions to follow before requesting tokens
class GiveTokens extends React.Component {
    constructor(props) {
        super(props);
    };

    /* --- Hides window --- */
    closeWindow() {
        document.getElementById('giveTokensTool').style.display = 'none';
    }


    render() {
        return (
            // Modal body, with interchangeable nested window
            <div className="migration-overlay" id="migration-modal">
                <div className="modal-dialog" tabIndex="-1">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h2>Get Test Tokens</h2>
                            <p><strong>Make sure to follow the instructions before pressing the button</strong></p>
                        </div>
                        <div className="modal-body text-center">
                            <p>Make sure you have MetaMask installed, and if not, <a href="https://metamask.io/">install it.</a></p>
                            <p>Follow steps 1 and 2 here : <a href="https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc">How to Get on Rinkeby</a></p>
                            <p>You should now have geth installed.</p>
                            <p>Run geth in a command window with the following command</p>
                            <p><strong>geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal</strong></p>
                            <p>In the instructions that follow, you should see the following: </p>
                            <p>HTTP endpoint opened url=http://127.0.0.1:8545 cors= vhosts=localhost</p>
                            <p>This means that you're mining the Rinkeby nodes to your computer, make sure to end this process
                            when you are finished adding tokens, otherwise your bandwidth will be burdened.</p>
                            <p>Now, open MetaMask and click the top dropdown where it says "main network" and change it to the
                                Rinkeby network.</p>
                            <p>If you already have an account, then log in, otherwise create an account through MetaMask on the Rinkeby network</p>
                            <p>Now you're ready to receive the test coins that are listed on this site. They are purely for testing / demonstration
                            purposes and have no value beyond that.</p>
                            <p><strong>**Note**</strong> Your MetaMask account will only receive my 4 tokens, <strong>not Ether</strong>.
                                If you want Ether, follow step 4 <a href="https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc">here</a>.
                            When asked to post your public key, make sure to copy your public key from MetaMask.</p>

                            <button className="btn btn-success" onClick={get_tokens}>Get Tokens</button>
                        </div>
                        <button className="btn btn-default btn-close" onClick={this.closeWindow}>Close Window</button>
                    </div>
                </div>
            </div>
        )
    }
}

// React component initialization for give tokens tool
ReactDOM.render(<GiveTokens/>, document.getElementById('giveTokensTool'));

$('#giveTokens').click(function(event) {
    document.getElementById('giveTokensTool').style.display ='block';
});