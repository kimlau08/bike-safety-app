import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

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

        if ( reportsByType === JSON.stringify({}) ) {
        return <div></div>      //no data to display
        }

        reportsByType = JSON.parse(reportsByType);

        let hazardReports=reportsByType["hazard"]; 

        //sort by occurred_at date
        hazardReports.sort(function(a, b) {
            return b.occurred_at - a.occurred_at;
        })

        //hazard reports do not come with images. use generic images 
        let hazardObjList=[];
        for (let i=0; i<hazardReports.length; i++) {

            let description="";
            if (hazardReports[i].description !== null) {

                description = hazardReports[i].description;

                if (description.length > 0) {
                    //Take only first 30 words.
                    let maxLength=30;
                    let descArray = description.trim().split(" ").slice(0, maxLength);
                    description = descArray.join(' ');
                }
            }

            hazardObjList.push(  {bikeImg: genericImg,
                        reportTitle: hazardReports[i].title,
                        description: description });

            if ( hazardObjList.length >= 3 ) {   //only need 3 reports
                break;
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

            {this.displayMostRecentHazards()}

            </div>
        )
    }
}

