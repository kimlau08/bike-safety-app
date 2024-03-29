import React from 'react';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/unconfirmed.webp'

const displayMostRecentUnconfirmed = (props) => {

    let reportsByType = props.getReportsByTypeCallback();

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

        //Take only first 60 words.
        let maxLength=60;
        let descArray = description.trim().split(" ").slice(0, maxLength);
        description = descArray.join(' ');

        //add report info as obj
        unconfirmedObjList.push(  {bikeImg: genericImg,
                    reportTitle: unconfirmedReports[i].title,
                    description: description });

        if ( unconfirmedObjList.length >= 3 ) {   //only need 3 reports
            break;
        }
    }

    return (
    <div className="bike-img-row">

        {/* invoke ImageRow to display sample report descriptions */}
        <ImageRow imgObjList={JSON.stringify(unconfirmedObjList)} />

    </div>
    )
}

export default function UnconfirmedSort (props) {
    
    if (props.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let toContainerId="unconfirmed-sort-container";
        
    props.swapDisplayCallback(toContainerId, props);

    return (
        <div id={toContainerId}>

        {/* invoke GraphByZip to render graph of incident by zip code */}
        <GraphByZip  
            reportType={'unconfirmed'} 
            graphTitle={'Unconfirms by Zip codes'}
            getLocationsByTypeCallback={props.getLocationsByTypeCallback} />

        {displayMostRecentUnconfirmed(props)}

        </div>
    )

}

