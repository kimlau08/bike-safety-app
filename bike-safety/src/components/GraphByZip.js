import React from 'react';

import BarChart from './BarChart';

const sortReportsByZip = (locationsByType, typeOfReport) => {

    let reportList = [];
    let reportType = "";
    if ( typeOfReport === "ALL" ) {

        //all types of reports are included in the zip analysis. concat all report types
        for (let i in locationsByType ) {  //locationByType is an object of arrays
            reportList = reportList.concat(locationsByType[i]);
        }

    } else {

        reportType = typeOfReport.toLowerCase();

        //get reports of given type
        if (locationsByType[reportType] === 0 || 
            locationsByType[reportType] === undefined ) {
                return [] ;      //no data 
        }
    
        reportList = locationsByType[reportType];
    }  

    //gather reports by zip
    let reportsByZip = {};  
    for (let i=0; i<reportList.length; i++) {
        if ( reportList[i].zip.toLowerCase() in reportsByZip )  {

            //save report to the array for incidents of the same type
            reportsByZip[reportList[i].zip.toLowerCase()].push(reportList[i])   

        } else {

            //first report of that type. Start with an array of 1 elem
            Object.assign(  reportsByZip, { [ reportList[i].zip.toLowerCase() ] : [ reportList[i] ]} ) 
        
        }
    }

    //map reports object to an array of form [  [key, reports], [key, reports], ...  ]
    let reportArray=Object.keys(reportsByZip).map(function(key) {
        return [key.toLowerCase(), reportsByZip[key]];
    });

    //sort descending order of number of reports for each type. longest array first.
    reportArray.sort (function (a, b) {
        return b[1].length - a[1].length;
    })

    return reportArray;  

}

const graphIncidentZips = (reportType, graphTitle, getLocationsByType) => {

    let locationsByType = JSON.parse( getLocationsByType() );

    //reportArray : a 2D array. 1st dimension is graph label. 2nd is array of data points
    let reportArray = sortReportsByZip(locationsByType, reportType);

    //create lables and data points
    let labels = []; //bar labels
    let incidentCnts = []; //bar lengths
    for (let i=0; i<reportArray.length; i++) {
      labels.push(reportArray[i][0])    //save label
      incidentCnts.push(reportArray[i][1].length);  //save data point
    }

    return (
      <div  className="chart-box">
         <BarChart graphTitle={graphTitle}
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
    let graphTitle=props.graphTitle;
    let reportType = props.reportType;

    return (
        <div>
            {graphIncidentZips(reportType, graphTitle, getLocationsByType)}
        </div>
    )
}
