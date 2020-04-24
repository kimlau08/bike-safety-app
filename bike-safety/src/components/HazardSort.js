import React from 'react';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/bike-trail.jpg'

const displayMostRecentHazards = (props) => {

    let reportsByType = props.location.getReportsByTypeCallback();

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
        if (hazardReports[i].description === null  ||
            hazardReports[i].description.length <= 0) {
            continue
        }

        description = hazardReports[i].description;

        //Take only first 60 words.
        let maxLength=60;
        let descArray = description.trim().split(" ").slice(0, maxLength);
        description = descArray.join(' ');

        hazardObjList.push(  {bikeImg: genericImg,
                    reportTitle: hazardReports[i].title,
                    description: description });

        if ( hazardObjList.length >= 3 ) {   //only need 3 reports
            break;
        }
    }

    return (
    <div className="bike-img-row">

        <ImageRow imgObjList={JSON.stringify(hazardObjList)} />

    </div>
    )
}

export default function HazardSort (props)  {

    if (props.location.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let toContainerId="hazard-sort-container";
        
        props.location.swapDisplayCallback(toContainerId, props);

    return (
        <div id={toContainerId}>

        <GraphByZip  
            reportType={'hazard'} 
            graphTitle={'Hazards by Zip codes'}
            getLocationsByTypeCallback={props.location.getLocationsByTypeCallback} />

        {displayMostRecentHazards(props)}

        </div>
    )

}

