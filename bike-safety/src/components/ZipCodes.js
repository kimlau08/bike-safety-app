import React from 'react';
import '../App.css';

import GraphByZip from './GraphByZip';
import ImageRow from './ImageRow';
import genericImg from '../assets/zip.webp'

const displayMostRecentIncidents = (props) => {

    let reportsByType = props.getReportsByTypeCallback();

    if ( reportsByType === JSON.stringify({}) ) {
    return <div></div>      //no data to display
    }

    reportsByType = JSON.parse(reportsByType);

    let incidentReports=[];
    //All types are needed. concat them
    for (let i in reportsByType)  {
        incidentReports = incidentReports.concat( reportsByType[i] );
    }

    //sort by occurred_at date
    incidentReports.sort(function(a, b) {
        return b.occurred_at - a.occurred_at;
    })

    //many reports do not come with images. use generic images 
    let incidentObjList=[];
    for (let i=0; i<incidentReports.length; i++) {
        if (incidentReports[i].media.image_url !== null) {

            let description="";
            if (incidentReports[i].description === null ||
                incidentReports[i].description.length <= 0) {
                continue;
            }

            description = incidentReports[i].description;

            //Take only first 60 words.
            let maxLength=60;
            let descArray = description.trim().split(" ").slice(0, maxLength);
            description = descArray.join(' ');

            //add report info as obj
            incidentObjList.push(  {bikeImg: genericImg,
                        reportTitle: incidentReports[i].title,
                        description: description });

            if ( incidentObjList.length >= 3 ) {   //only need 3 reports
                break;
            }
        }     
    }

    return (
    <div className="bike-img-row">

        {/* invoke ImageRow to display sample report descriptions */}
        <ImageRow imgObjList={JSON.stringify(incidentObjList)} />

    </div>
    )
}


export default function ZipCodes (props) {

    if (props.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let toContainerId="zip-codes";       
    props.swapDisplayCallback(toContainerId, props);

    return (
        <div id={toContainerId}>

        {/* invoke GraphByZip to render graph of incident by zip code */}
        <GraphByZip  
            reportType={'ALL'} 
            graphTitle={'All reports by Zip codes'}
            getLocationsByTypeCallback={props.getLocationsByTypeCallback}
            />

        
        {displayMostRecentIncidents(props)}

        </div>
    )
}

