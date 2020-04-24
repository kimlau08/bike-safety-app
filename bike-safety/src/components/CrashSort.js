import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

export default class CrashSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }
    }
    
    displayMostRecentCrash() {

        let reportsByType = this.props.location.getReportsByTypeCallback();

        if ( reportsByType === JSON.stringify({}) ) {
        return <div></div>      //no data to display
        }

        reportsByType = JSON.parse(reportsByType);

        let crashReports=reportsByType["crash"]; 

        //sort by occurred_at date
        crashReports.sort(function(a, b) {
            return b.occurred_at - a.occurred_at;
        })

        //crash reports do not come with images. use generic images 
        let crashObjList=[];
        for (let i=0; i<crashReports.length; i++) {
            let description="";
            if (crashReports[i].description !== null) {

                description = crashReports[i].description;

                //Take only first 30 words.
                if (description.length > 0) {
                    let maxLength=30;
                    let descArray = description.trim().split(" ").slice(0, maxLength);
                    description = descArray.join(' ');
                }
            }

            crashObjList.push(  {bikeImg: genericImg,
                        reportTitle: crashReports[i].title,
                        description: description });

            if ( crashObjList.length >= 3 ) {   //only need 3 reports
                break;
            }
        }

        return (
        <div className="bike-img-row">

            <ImageRow imgObjList={JSON.stringify(crashObjList)} />

        </div>
        )
    }
        
    render() {

        if (this.props.location.getLocationsByTypeCallback === undefined) {
            return <div></div>    //no callback to get data
        }

        let toContainerId="crash-sort-container";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }

            <GraphByZip  
                reportType={'crash'} 
                graphTitle={'Crashes by Zip codes'}
                getLocationsByTypeCallback={this.props.location.getLocationsByTypeCallback} />

            {this.displayMostRecentCrash()}

            </div>
        )
    }
}

