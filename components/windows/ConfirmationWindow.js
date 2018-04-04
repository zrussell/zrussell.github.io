import React from "react";

class ConfirmationWindow extends React.Component {
    constructor(props) {
        super(props);
        this.props.estimateGas();
    }

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Confirmation</h2>
                </div>
                <div className="modal-body text-center">
                    <p>If all the information is correct, begin </p>
                    {/* TODO: add estimate gas cost of migrate*/}
                    <h3> Estimated Gas Cost </h3>
                    <h3> Added tokens </h3>
                    <ul className="list-group">
                    </ul>
                    <br />
                </div>
                <button className="btn btn-default btn-previous" onClick={this.props.previousWindow}>Previous (Balances)</button>
                <button className="btn btn-default btn-next" onClick={this.props.nextWindow}>Begin Migration</button>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close</button>
            </div>
        )
    }
}

export default ConfirmationWindow;