import React from 'react';

class PopulationIntroductionWindow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Populate DEX Smart Contract With balances</h2>
                    <p>A tool for populating the "Transfer From" DEX with balances</p>
                </div>
                <div className="modal-body text-center">
                    <p><strong> * Only For Testing / Demonstration * </strong></p>

                    <p>This tool is used to populate the smart contract <em>balanceFrom</em> with token balances.<br/>
                         The purpose of adding balances to balanceFrom with this tool is to demonstrate balance transfer<br/>
                         from <em>balanceFrom</em> to <em>balanceTo</em>, using the Migration Utility.<br/>
                        <br/>
                        <strong>Prerequisites</strong>
                         Make sure you've done the following before attempting to use this tool.<br/>
                        - Install geth and follow the tutorial located <a href="">here</a><br/>
                        <br/>
                        - Synchronize the Rinkeby blockchain and host it on your local ip (localhost) using the command,<br/>
                        <br/>
                            <strong>geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal</strong><br/>
                        <br/>
                        - Install a browser extension that injects web3 (I recommend MetaMask), and connect it to the<br/>
                        Rinkeby testnet<br/>
                        <br/>
                        - Run the node file, unlock_rinkeby_account.js file that's provided in this GitHub repository,<br/>
                        but replace the provided public and private key with the public and private key of the Rinkeby<br/>
                        account that you created in the Rinkeby tutorial, and the to address with your MetaMask account.<br/>
                        This file will unlock your account for x seconds where x is the 'seconds' command line argument,<br/>
                        and add 1 Ether unit of each coin of the following coins to your account:<br/>
                            SMPL, SMPL2, TWLD, COIN **Note that these coins have no real value**<br/>
                        <br/>
                        The command to run the node file is as follows:<br/>
                        <br/>
                            <strong>node unlock_rinkeby_account.js 'seconds'</strong><br/>
                        <br/>
                        You should see tokens in your user wallet, which you can transfer to the <em>balanceFrom</em><br/>
                        contract.<br/>
                    </p>
                </div>
                <button className="btn btn-default btn-next" onClick={this.props.nextWindow}>Proceed</button>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close</button>
            </div>
        )
    }
}

export default PopulationIntroductionWindow;