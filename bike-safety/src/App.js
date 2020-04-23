import React, { Component } from 'react';
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';

import BarChart from './components/BarChart';
import Home from './components/Home';
import HazardSort from './components/HazardSort';
import TheftSort from './components/TheftSort';
import CrashSort from './components/CrashSort';
import ZipCodes from './components/ZipCodes';
import Filters from './components/Filters';
import { findAllInRenderedTree } from 'react-dom/test-utils';


const reportTypes = [
  "crash",
  "hazard",
  "theft",
  "unconfirmed",
  "infrastructure_issue",
  "chop_shop"
];
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      response: [],
      axiosDataLoaded: false,

      reportsByType: {},
      currentLocation: "Austin, TX", //city or zip

      //default query parms
      resultPage:   2,
      cityState:    "Austin, TX",
      zip:           "",
      proximity_sq:  100,
      keyword:       "",

      containerOnDisplay: "homeContainer"
    }

    this.getBikeWiseData=this.getBikeWiseData.bind(this);
    this.customQuery=this.customQuery.bind(this);
    this.navBar=this.navBar.bind(this);

    this.createQueryURL=this.createQueryURL.bind(this);
    this.createMultipleURLs=this.createMultipleURLs.bind(this);

    this.stackReportsByType=this.stackReportsByType.bind(this);
    this.sortReportTypes=this.sortReportTypes.bind(this);

    this.graphIncidentTypes=this.graphIncidentTypes.bind(this);
    this.displayMostRecentThefts=this.displayMostRecentThefts.bind(this);

    this.swapContainerOnDisplay=this.swapContainerOnDisplay.bind(this);

  }

 
  stackReportsByType () {

    let reports={}

    //initialize with all report types and empty arrays
    for (let i=0; i<reportTypes.length; i++) {
      Object.assign(  reports, { [ reportTypes[i].toLowerCase() ] : [ ]} ) 
    }

    let resp=this.state.response;
    for (let i=0; i<resp.length; i++) {
      if ( resp[i].type.toLowerCase() in reports )  {

        reports[resp[i].type.toLowerCase()].push(resp[i])   //save report

      } else {

        //first report of that type. Start with an array of 1 elem
        Object.assign(  reports, { [ resp[i].type.toLowerCase() ] : [ resp[i] ]} ) 
        
      }
    }

    this.setState(  {reportsByType: reports}  )

  }

  sortReportTypes(reports) {

    //map reports object to an array of form [  [key, reports], [key, reports], ...  ]
    let reportArray=Object.keys(reports).map(function(key) {
      return [key.toLowerCase(), reports[key]];
    });

    //sort descending order
    reportArray.sort (function (a, b) {
      return b[1].length - a[1].length;
    })

    return reportArray;  
  }

  graphIncidentTypes() {

    //reportArray : a 2D array. 1st dimension is graph label. 2nd is array of data points
    let reportArray = this.sortReportTypes(this.state.reportsByType);

    //create lables and data points
    let labels = []; //bar labels
    let incidentCnts = []; //bar lengths
    for (let i=0; i<reportArray.length; i++) {
      labels.push(reportArray[i][0])
      incidentCnts.push(reportArray[i][1].length);
    }

    return (
      <div  className="chartBox">
         <BarChart graphTitle="Incidents by Types" 
                labels={JSON.stringify(labels)} 
                dataPoints={JSON.stringify(incidentCnts)} />
      </div>

    )
  }

  displayImgCard(imgCardInfo) {
    return (
      <div className="bikeImgCard">
        <p className="reportTitle">{imgCardInfo.reportTitle}</p>
        <img className="bikeImg" src={imgCardInfo.bikeImg} />
      </div>
    )
  }

  displayMostRecentThefts() {

    if ( JSON.stringify(this.state.reportsByType) === JSON.stringify({}) ) {
      return <div></div>      //no data to display
    }

    let theftReports=this.state.reportsByType["theft"]; 

    //sort by update date
    theftReports.sort(function(a, b) {
      return b.updated_at - a.updated_at;
    })

    //find 3 reports with media
    let theftImg=[];
    for (let i=0; i<theftReports.length; i++) {
      if (theftReports[i].media.image_url !== null) {

        theftImg.push(  {bikeImg: theftReports[i].media.image_url,
                         reportTitle: theftReports[i].title });

        if ( theftImg.length >= 3 ) {   //only need 3 reports
          break;
        }
      }     
    }

    return (
      <div className="bikeImgRow">
          {theftImg.map( this.displayImgCard ) }
      </div>
    )
  }


  createQueryURL( FilterObj ) {
    

    //Default URL:
    // https://bikewise.org:443/api/v2/incidents?page=1&proximity=Dallas%2C%20TX&proximity_square=100

    
    //Default filter values
    let resultPage=this.state.resultPage;
    let cityState=this.state.cityState;
    let zip=this.state.zip;
    let proximity_sq=this.state.proximity_sq;
    let keyword=this.state.keyword;

    //fill in custom filter values
    if ( FilterObj !== undefined ) {
      cityState=FilterObj.city;
      zip=FilterObj.zip;
      proximity_sq=FilterObj.proximity_sq;
      keyword=FilterObj.keyword
    }

    let queryURL =  "https://bikewise.org:443/api/v2/incidents?page="+resultPage+"&proximity="+cityState+"&proximity_square="+proximity_sq;

    if (keyword.length != 0) {
      queryURL += "&query=" + keyword;
    }

    
    //substitutue space and comma in query (e.g. cityState, incidentType)
    queryURL.replace(/ /g, "%20");
    queryURL.replace(/,/g, "%2C");


    return queryURL;    
  }

  createMultipleURLs ( FilterObj ) {

    let url=this.createQueryURL( FilterObj );
    let urls=[];
    for ( let i=0; i<reportTypes.length; i++) {

      //substitutue space and comma in query (e.g. cityState, incidentType)
      let queryURL = url + "&incident_type=" + reportTypes[i]
      queryURL.replace(/ /g, "%20");
      queryURL.replace(/,/g, "%2C");

      urls.push(queryURL);

    }
    return urls;
  }

  async getBikeWiseData( FilterObj ) {

    let queryURL = this.createQueryURL( FilterObj );
    try {
      const response=await axios.get(queryURL);
      console.log("getHTTP response:", response.data.incidents);

      this.setState({response: response.data.incidents})

      this.stackReportsByType(response);

    } catch (e) {
      console.error(e);
    }
  }

  simultaneousRequests(urls) {

    this.setState( { response : []}); //clear previous data

    //launch a few ajax request simultaneously using Promise.all
    Promise.all(urls.map((url)=>
      axios.get(url)
      .then (response=> {
        let resp=response.data.incidents;
        console.log('new resp is in simultaneous mode--->', resp);

        let arr=this.state.response;
        arr = arr.concat(resp);
  
        this.setState({response: arr});   

        this.stackReportsByType(arr);

      })
      .catch(error=>{
        console.log('there is an error', error)
      })
    )) 
  }

  
  customQuery( FilterObj ) {

    let urls=this.createMultipleURLs( FilterObj );
    this.simultaneousRequests(urls); 

  }

  componentDidMount() {

    let urls=this.createMultipleURLs(  );
    this.simultaneousRequests(urls);  

  }

  swapContainerOnDisplay(toContainerId, inputProps) {   

  }

  navBar() {
    return (
      <div>
        <Router>
            <nav className="menu">
              <ul className="menuBar">
                <li>  <Link to="/Home">Home</Link> </li>

                <li> <Link to="/HazardSort">Hazard Sort</Link> </li>

                <li>  <Link to="/TheftSort">Theft Sort</Link>  </li>

                <li>  <Link to="/CrashSort">Crash Sort</Link>  </li>

                <li>  <Link to="/ZipCodes">Zip Codes</Link> </li>

                <li>
                  <Link to={{
                      pathname: "/Filters",
                      customQueryCallback: this.customQuery,
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Filters</Link>
                </li>

              </ul>

            </nav>

            <h2 className="logoLine">Bike Safety</h2>

            <Switch>
              <Route path="/Home" component={Home} />

              <Route path="/HazardSort" component={HazardSort} />

              <Route path="/TheftSort" component={TheftSort} />

              <Route path="/CrashSort" component={CrashSort} />

              <Route path="/ZipCodes" component={ZipCodes} />

              <Route path="/Filters" component={Filters} />

            </Switch>
        </Router>
      </div>
    )
  }

  render() {
    return (
      <div className="App">

        {this.navBar()}
        <Router>
          <Redirect to='/Home' />  
        </Router>

        {this.graphIncidentTypes()}
        {this.displayMostRecentThefts()}
      </div>
    );
  }
}

