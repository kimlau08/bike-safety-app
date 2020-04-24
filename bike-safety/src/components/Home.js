import React, { Component } from 'react';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render () {

        if (this.props.location.swapDisplayCallback !== undefined) {
            this.props.location.swapDisplayCallback("homeContainer", this.props);
        }
        return (
            <div>
            </div>
        )

    }
}
