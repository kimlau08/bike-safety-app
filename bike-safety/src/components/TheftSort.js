import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

export default class TheftSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }
    }

    displayMostRecentTheftDesc() {

        let reportsByType = this.props.location.getReportsByTypeCallback();

        if ( reportsByType === JSON.stringify({}) ) {
        return <div></div>      //no data to display
        }

        reportsByType = JSON.parse(reportsByType);

        let theftReports=reportsByType["theft"]; 

        //sort by occurred_at date
        theftReports.sort(function(a, b) {
            return b.occurred_at - a.occurred_at;
        })

        //theft reports do not come with images. use generic images 
        let theftObjList=[];
        for (let i=0; i<theftReports.length; i++) {
            if (theftReports[i].media.image_url !== null) {

                let description="";
                if ("description" in theftReports[i]) {

                    description = theftReports[i].description;

                    if (description.length > 0) {
                        //Take only first 30 words.
                        let maxLength=30;
                        let descArray = description.trim().split(" ").slice(0, maxLength);
                        description = descArray.join(' ');                        
                    }
                }

                theftObjList.push(  {bikeImg: genericImg,
                            reportTitle: theftReports[i].title,
                            description: description });

                if ( theftObjList.length >= 3 ) {   //only need 3 reports
                    break;
                }
            }     
        }

        return (
        <div className="bikeImgRow">

            <ImageRow imgObjList={JSON.stringify(theftObjList)} />

        </div>
        )
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
                reportType={'theft'} 
                graphTitle={'Thefts by Zip codes'}
                getLocationsByTypeCallback={this.props.location.getLocationsByTypeCallback}
                />

            {this.displayMostRecentTheftDesc()}

            </div>
        )
    }
}

