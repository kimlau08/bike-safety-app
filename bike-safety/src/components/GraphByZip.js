import React from 'react';

import BarChart from './BarChart';

const sortReportsByZip = (locationsByType, typeOfReport) => {

    //get reports of given type
    let reportType = typeOfReport.toLowerCase();
    if (locationsByType[reportType] === 0 || 
        locationsByType[reportType] === undefined ) {
            return [] ;      //no data 
    }

    //gather reports by zip
    let reportList = locationsByType[reportType];
    let reportsByZip = {};  
    for (let i=0; i<reportList.length; i++) {
        if ( reportList[i].zip.toLowerCase() in reportsByZip )  {

            reportsByZip[reportList[i].zip.toLowerCase()].push(reportList[i])   //save report

        } else {

            //first report of that type. Start with an array of 1 elem
            Object.assign(  reportsByZip, { [ reportList[i].zip.toLowerCase() ] : [ reportList[i] ]} ) 
        
        }
    }

    //map reports object to an array of form [  [key, reports], [key, reports], ...  ]
    let reportArray=Object.keys(reportsByZip).map(function(key) {
        return [key.toLowerCase(), reportsByZip[key]];
    });

    //sort descending order of number of reports
    reportArray.sort (function (a, b) {
        return b[1].length - a[1].length;
    })

    return reportArray;  

}

const graphIncidentZips = (reportType, getLocationsByType) => {

    let locationsByType = JSON.parse( getLocationsByType() );

    //reportArray : a 2D array. 1st dimension is graph label. 2nd is array of data points
    let reportArray = sortReportsByZip(locationsByType, reportType);

    //create lables and data points
    let labels = []; //bar labels
    let incidentCnts = []; //bar lengths
    for (let i=0; i<reportArray.length; i++) {
      labels.push(reportArray[i][0])
      incidentCnts.push(reportArray[i][1].length);
    }

    return (
      <div  className="chartBox">
         <BarChart graphTitle="Hazards by Zip codes" 
                labels={JSON.stringify(labels)} 
                dataPoints={JSON.stringify(incidentCnts)} />
      </div>

    )
}

export default function GraphByZip (props) {

    if (props.getLocationsByTypeCallback === undefined) {
        return <div></div>    //no callback to get data
    }

    let getLocationsByType = props.getLocationsByTypeCallback;
    let reportType = props.reportType;

    return (
        <div>
            {graphIncidentZips(reportType, getLocationsByType)}
        </div>
    )
}
