import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

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
            if ( reportList[i].type.toLowerCase() in reportsByZip )  {
    
                reportsByZip[reportList[i].type.toLowerCase()].push(reportList[i])   //save report
    
            } else {
    
                //first report of that type. Start with an array of 1 elem
                Object.assign(  reportsByZip, { [ reportList[i].type.toLowerCase() ] : [ reportList[i] ]} ) 
            
            }
        }
    }
    
    

    render() {

        if (this.props.location.getLocationsByTypeCallback === undefined) {
            return <div></div>    //no callback to get data
        }

        let locationsByType = JSON.parse(this.props.location.getLocationsByTypeCallback());

        let hazardReports = this.sortReportsByZip (locationsByType, "hazard");

        let toContainerId="hazardSortContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }


            </div>
        )
    }
}

