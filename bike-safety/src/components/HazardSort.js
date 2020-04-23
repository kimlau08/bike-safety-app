import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import GraphByZip from './GraphByZip';

export default class HazardSort extends Component {
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

        let toContainerId="hazardSortContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }

            <GraphByZip  
                reportType={'hazard'} 
                graphTitle={'Hazards by Zip codes'}
                getLocationsByTypeCallback={this.props.location.getLocationsByTypeCallback} />

            </div>
        )
    }
}

