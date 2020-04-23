import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class HazardSort extends Component {
    constructor(props) {
        super(props);

        this.state={

            redirectToHome: false 
        }

        this.sortHazardReportByZip=this.sortHazardReportByZip.bind(this);
    }

    sortReportsByZip(reportsByType, typeOfReport) {

        //get reports of given type
        let reportType = typeOfReport.toLowerCase();
        if (reportsByType[reportType] === 0 || 
            reportsByType[reportType] === undefined ) {
                return [] ;      //no data 
            }

        //gather reports by zip
        let reportList = reportsByType[reportType];
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

        if (this.props.location.getReportsByTypeCallBack === undefined) {
            return <div></div>    //no callback to get data
        }

        let reportsByType = JSON.parse(this.props.location.getReportsByTypeCallBack());

        let hazardReports = this.sortHazardReportByZip (reportsByType);

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

