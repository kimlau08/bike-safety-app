import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import GraphByZip from './GraphByZip';

export default class ZipCodes extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }
    }
    
    render() {

        if (this.props.location.getLocationsByTypeCallback === undefined) {
            return <div></div>    //no callback to get data
        }

        let toContainerId="theftSortContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }

            <GraphByZip  
                reportType={'ALL'} 
                graphTitle={'All reports by Zip codes'}
                getLocationsByTypeCallback={this.props.location.getLocationsByTypeCallback}
                />

            </div>
        )
    }
}

