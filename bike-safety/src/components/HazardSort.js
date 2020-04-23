import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import BarChart from './BarChart';

export default class HazardSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }

        this.sortReportsByZip=this.sortReportsByZip.bind(this);
    }

    sortReportsByZip(locationsByType, typeOfReport) {

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
    
    graphIncidentZips() {

        let locationsByType = JSON.parse(this.props.location.getLocationsByTypeCallback());

        //reportArray : a 2D array. 1st dimension is graph label. 2nd is array of data points
        let reportArray = this.sortReportsByZip(locationsByType, "hazard");
    
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
    
    render() {

        if (this.props.location.getLocationsByTypeCallback === undefined) {
            return <div></div>    //no callback to get data
        }

        let toContainerId="hazardSortContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }

            {this.graphIncidentZips()}

            </div>
        )
    }
}

