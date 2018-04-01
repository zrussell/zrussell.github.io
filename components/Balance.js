import React from "react";

class Balance extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr onClick={this.props.onChange} className={this.props.checked ? "success" : ""}>
                <td><input type="checkbox"
                           onChange={this.props.onChange}
                           checked={this.props.checked}/></td>
                <td>{this.props.symbol}</td>
                <td>{this.props.balance}</td>
            </tr>
        )
    }
}

export default Balance;