import React from 'react';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/theft.jpg';

const displayMostRecentThefts = (props) => {

    let reportsByType = props.getReportsByTypeCallback();

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

        //Take only first 60 words.
        let maxLength=60;
        let descArray = description.trim().split(" ").slice(0, maxLength);
        description = descArray.join(' ');                        

        //add report info as obj
        theftObjList.push(  {bikeImg: genericImg,
                    reportTitle: theftReports[i].title,
                    description: description });

        if ( theftObjList.length >= 3 ) {   //only need 3 reports
            break;
        }
    }

    return (
    
    <div className="bike-img-row">

        {/* invoke ImageRow to display sample report descriptions */}
        <ImageRow imgObjList={JSON.stringify(theftObjList)} />

    </div>
    )
}
export default function TheftSort (props) {

    if (props.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let toContainerId="theft-sort-container";
        
    props.swapDisplayCallback(toContainerId, props);

    return (
        <div id={toContainerId}>
        
        {/* invoke GraphByZip to render graph of incident by zip code */}
        <GraphByZip  
            reportType={'theft'} 
            graphTitle={'Thefts by Zip codes'}
            getLocationsByTypeCallback={props.getLocationsByTypeCallback}
            />

        {displayMostRecentThefts(props)}

        </div>
    )
}

