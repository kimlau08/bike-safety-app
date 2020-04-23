import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

export default class UnconfirmedSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }
    }
    
    displayMostRecentUnconfirmed() {

        let reportsByType = this.props.location.getReportsByTypeCallback();

        if ( reportsByType === JSON.stringify({}) ) {
        return <div></div>      //no data to display
        }

        reportsByType = JSON.parse(reportsByType);

        let unconfirmedReports=reportsByType["unconfirmed"]; 

        //sort by occurred_at date
        unconfirmedReports.sort(function(a, b) {
            return b.occurred_at - a.occurred_at;
        })

        //unconfirmed reports do not come with images. use generic images 
        let unconfirmedObjList=[];
        for (let i=0; i<unconfirmedReports.length; i++) {

            let description="";
            if (unconfirmedReports[i].description === null ||
                unconfirmedReports[i].description.length <= 0) {
                continue;
            }

            description = unconfirmedReports[i].description;

            //Take only first 30 words.
            let maxLength=30;
            let descArray = description.trim().split(" ").slice(0, maxLength);
            description = descArray.join(' ');

            unconfirmedObjList.push(  {bikeImg: genericImg,
                        reportTitle: unconfirmedReports[i].title,
                        description: description });

            if ( unconfirmedObjList.length >= 3 ) {   //only need 3 reports
                break;
            }
        }

        return (
        <div className="bikeImgRow">

            <ImageRow imgObjList={JSON.stringify(unconfirmedObjList)} />

        </div>
        )
    }
        
    render() {

        if (this.props.location.getLocationsByTypeCallback === undefined) {
            return <div></div>    //no callback to get data
        }

        let toContainerId="unconfirmedSortContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }

            <GraphByZip  
                reportType={'unconfirmed'} 
                graphTitle={'Unconfirms by Zip codes'}
                getLocationsByTypeCallback={this.props.location.getLocationsByTypeCallback} />

            {this.displayMostRecentUnconfirmed()}

            </div>
        )
    }
}

