import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

const displayMostRecentTheftDesc = (props) => {

    let reportsByType = props.location.getReportsByTypeCallback();

    if ( reportsByType === JSON.stringify({}) ) {
    return <div></div>      //no data to display
    }

    reportsByType = JSON.parse(reportsByType);

    let theftReports=reportsByType["theft"]; 

    //sort by occurred_at date
    theftReports.sort(function(a, b) {
        return b.occurred_at - a.occurred_at;
    })

    //use generic images for sample descriptions.
    let theftObjList=[];
    for (let i=0; i<theftReports.length; i++) {

        let description="";
        if (theftReports[i].description === null ||
            theftReports[i].description.length <= 0) {
                continue;
        }

        description = theftReports[i].description;

        if (description.length > 0) {
            //Take only first 30 words.
            let maxLength=30;
            let descArray = description.trim().split(" ").slice(0, maxLength);
            description = descArray.join(' ');                        
        }

        theftObjList.push(  {bikeImg: genericImg,
                    reportTitle: theftReports[i].title,
                    description: description });

        if ( theftObjList.length >= 3 ) {   //only need 3 reports
            break;
        }
    }

    return (
    <div className="bike-img-row">

        <ImageRow imgObjList={JSON.stringify(theftObjList)} />

    </div>
    )
}
export default function TheftSort (props) {

    if (props.location.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let toContainerId="theft-sort-container";
        
    props.location.swapDisplayCallback(toContainerId, props);

    return (
        <div id={toContainerId}>

        <GraphByZip  
            reportType={'theft'} 
            graphTitle={'Thefts by Zip codes'}
            getLocationsByTypeCallback={props.location.getLocationsByTypeCallback}
            />

        {displayMostRecentTheftDesc(props)}

        </div>
    )
}

