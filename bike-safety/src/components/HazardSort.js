import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

export default class HazardSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }
    }
    
    displayMostRecentHazards() {

        let reportsByType = this.props.location.getReportsByTypeCallback();

        if ( JSON.stringify(reportsByType) === JSON.stringify({}) ) {
        return <div></div>      //no data to display
        }

        let hazardReports=reportsByType["hazard"]; 

        //sort by occurred_at date
        hazardReports.sort(function(a, b) {
            return b.occurred_at - a.occurred_at;
        })

        //hazard reports do not come with images. use generic images 
        let hazardObjList=[];
        for (let i=0; i<hazardReports.length; i++) {
            if (hazardReports[i].media.image_url !== null) {

                hazardObjList.push(  {bikeImg: genericImg,
                                reportTitle: hazardReports[i].title });

                if ( hazardObjList.length >= 3 ) {   //only need 3 reports
                break;
                }
            }     
        }

        return (
        <div className="bikeImgRow">

            <ImageRow imgObjList={JSON.stringify(hazardObjList)} />

        </div>
        )
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

