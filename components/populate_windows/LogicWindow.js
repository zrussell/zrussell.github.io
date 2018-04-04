import React from 'react';


class PopulationIntroductionWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header text-center">
                    <h2>Populate</h2>
                    <p>Open JS console to view progress of populations</p>
                </div>
                <div className="modal-body text-center">
                        <h2>Add tokens to EtherDelta Contract</h2>
                    <button className="btn btn-default" value='0x0000000000000000000000000000000000000000' onClick={this.props.populate_ether}>Add 1 Ether </button>
                    <br /><br />
                    <button className="btn btn-default" value='0xbd7657592864edf460724af8f839b0b09f2102c4' onClick={this.props.populate_smpl}>Add 1 SampleToken</button>
                    <br /><br />
                    <button className="btn btn-default" value='0xb836985001d5227485b06be73f4cc132c32f4213' onClick={this.props.populate_smpl2}>Add 1 AnotherSampleToken</button>
                    <br /><br />
                    <button className="btn btn-default" value='0xf2ca14dea6456bac54d9501b55be0dc2e138a0fd' onClick={this.props.populate_twld}>Add 1 TwelveDecimals</button>
                    <br /><br />
                    <button className="btn btn-default" value='0x4568a35c14ea30001ae5ea5158ae47e9009553c9' onClick={this.props.populate_coin}>Add 1 Coin</button>
                    <br /><br />

                </div>
                <button className="btn btn-default btn-previous" onClick={this.props.previousWindow}>Previous</button>
                <button className="btn btn-default btn-close" onClick={this.props.closeWindow}>Close Window</button>
            </div>
        )
    }
}


export default PopulationIntroductionWindow;