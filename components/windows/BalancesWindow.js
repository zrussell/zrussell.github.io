import React from 'react';
import Balance from '../Balance'

class BalancesWindow extends React.Component {
    constructor(props) {
        super(props);

    }

    populateBalanceOptions() {
        return this.props.balances_options.map((balance, index) => {
            return (
                <Balance
                    onChange={() => this.props.onBalanceSelect(index)}
                    checked={balance.is_selected}
                    key={balance.addr}
                    symbol={balance.name}
                    balance={balance.balance}/>
            )
        });
    }

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Balances</h2>
                    <p>Currently on the EtherDelta Contract to be Transferred to the ForkDelta Contract </p>
                </div>
                <div className="modal-body text-center">
                    <div className="container migration-container">
                        <div className="row">
                            <div className="table-container">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Migrate</th>
                                        <th>Symbol</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.populateBalanceOptions()}
                                </tbody>
                            </table>
                                <br />
                            <button className="btn btn-success .btn-sm" onClick={this.props.selectAllBalances}>Select All</button>
                            <button className="btn btn-danger .btn-sm" onClick={this.props.deselectAllBalances}>Select None</button>
                            </div>
                        </div>
                        <div className="row">
                            <h2>Missing A Balance?</h2>
                            <p>Add tokens that aren't in our tokens list (Not supported on testnet)</p>
                            <form id="token-addr-form" onSubmit={this.props.handleTokenAdd}>
                                <div className="form-group">
                                    <label htmlFor="new-token-addr-input">Token Address</label>
                                    <input required size="42" pattern="^0x.{40}$" className="form-control"
                                           id="new-token-addr-input"
                                           placeholder="0x0000000000000000000000000000000000000000" />
                                </div>
                                <button type="submit" className="btn btn-default">Add token</button>
                            </form>
                        </div>
                    </div>
                </div>
                <button className="btn btn-default btn-previous" onClick={this.props.previousWindow}>Previous (Introduction)</button>
                <button className="btn btn-default btn-next" onClick={this.props.nextWindow}>Next (Confirmation)</button>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close</button>
            </div>
        )
    }
}

export default BalancesWindow;