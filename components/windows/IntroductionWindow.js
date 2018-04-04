import React from 'react';

class IntroductionWindow extends React.Component {
    constructor(props) {
        super(props);
        this.props.get_user_address();
    }
    render() {
        let user_addr = this.props.user_address;
        return (
            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Migration Tool</h2>
                    <p>Migrating balances from contractFrom to contractTo</p>
                </div>
                <div className="modal-body text-center">
                    <p>This tool is currently checking balances on the following account address</p>
                    <p><strong>{user_addr}</strong></p>

                </div>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close</button>
                <button className="btn btn-default btn-next" onClick={this.props.nextWindow}>Proceed</button>
            </div>
        )
    }
}

export default IntroductionWindow;