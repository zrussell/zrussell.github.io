import React from "react";

class SuccessWindow extends React.Component {
    render() {
        return (

            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Begin Migration</h2>
                    <p>If you're satisfied with the selected balances and gas cost, begin migration</p>
                </div>
                <div className="modal-body text-center">
                    <button className="btn btn-success" onClick={this.props.begin_migration}>Begin Migration</button>
                </div>
                <button className="btn btn-default btn-previous" onClick={this.props.previousWindow}>Previous</button>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close Migration Tool</button>
            </div>
        )
    }
}

export default SuccessWindow;