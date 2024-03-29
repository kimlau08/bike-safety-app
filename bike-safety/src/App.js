import React, { Component } from 'react';
import './App.css';

import {Route, Link, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import BarChart from './components/BarChart';
import Home from './components/Home';
import HazardSort from './components/HazardSort';
import TheftSort from './components/TheftSort';
import UnconfirmedSort from './components/unconfirmedSort'
import ZipCodes from './components/ZipCodes';
import Filters from './components/Filters';
import ImageRow from './components/ImageRow';
import config from './config/config';

import { connect } from 'react-redux';

const reportTypes = [
  "crash",
  "hazard",
  "theft",
  "unconfirmed",
  "infrastructure_issue",
  "chop_shop"
];
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      response: [],
      locations: [],
      axiosDataLoaded: false,

      locationsByType: this.initializeReportlists(),    //object of arrays, with geocodes, zip and type of reports
      reportsByType:   this.initializeReportlists(),    //objects of arrays of detailed reports
      currentLocation: "Houston, TX", //city or zip

      //default query parms
      cityState:    "Houston, TX",
      zip:           "",
      proximity_sq:  100,
      keyword:       "",

      containerOnDisplay: "home-container"
    }

    this.navBar=this.navBar.bind(this);

    this.getBikeWiseData=this.getBikeWiseData.bind(this);
    this.getZipData=this.getZipData.bind(this);
    this.customQuery=this.customQuery.bind(this);

    this.createQueryURL=this.createQueryURL.bind(this);
    this.createMultipleURLs=this.createMultipleURLs.bind(this);

    this.initStateDataByType=this.initStateDataByType.bind(this);
    this.listReportsByType=this.listReportsByType.bind(this);
    this.insertZipObjByType=this.insertZipObjByType.bind(this);

    this.sortReportTypes=this.sortReportTypes.bind(this);

    this.graphIncidentTypes=this.graphIncidentTypes.bind(this);
    this.displayMostRecentThefts=this.displayMostRecentThefts.bind(this);

    this.swapContainerOnDisplay=this.swapContainerOnDisplay.bind(this);
    this.setContainerOnDisplay=this.setContainerOnDisplay.bind(this);
  
    this.getLocationsByType=this.getLocationsByType.bind(this);
    this.getReportsByType=this.getReportsByType.bind(this);

  }

  getLocationsByType() {
    return JSON.stringify(this.state.locationsByType);
  }
  getReportsByType() {
    return JSON.stringify(this.state.reportsByType);
  }

  initializeReportlists() {

    let reports={}

    //initialize with all report types and empty arrays
    for (let i=0; i<reportTypes.length; i++) {
      Object.assign(  reports, { [ reportTypes[i].toLowerCase() ] : [ ]} ) 
    }

    return reports;
  }
  initStateDataByType () {

    //initialize both state data to an object of empty arrays. each corresponds to a report type
    let initDataObj = this.initializeReportlists();

    this.setState(  {locationsByType :initDataObj } );
    this.setState(  {reportsByType :initDataObj } );

  }

  listDataByType(reportList) {
    //group the report by report types

    let locations = this.state.locationsByType;

    for ( let i=0; i< reportList.length; i++ ) {
      if ( reportList[i].type.toLowerCase() in locations )  {

        locations[reportList[i].type.toLowerCase()].push(reportList[i])   //save report

      } else {

        //first report of that type. Start with an array of 1 elem
        Object.assign(  locations, { [ reportList[i].type.toLowerCase() ] : [ reportList[i] ]} ) 
        
      }
    }
  }

  insertZipObjByType (zipObj) {
    //insert the report by report types

    let locations=this.state.locationsByType;
    if ( zipObj.type.toLowerCase() in locations )  {

      locations[ zipObj.type.toLowerCase() ].push(zipObj)   //save report

    } else {

      //first report of that type. Start with an array of 1 elem
      Object.assign(  locations, { [ zipObj.type.toLowerCase() ] : [ zipObj ]} ) 
      
    }

    this.setState(  {locationsByType: locations}  )

  }

  listReportsByType (resp) {
    //group the reports by report types

    if (resp === undefined) {
      return; //no data
    }

    //initialize reports object with empty arrays. each corresponds to a report type
    let reports = this.initializeReportlists(); 

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
    //Sort the report types by occurrences

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
    let reportArray = this.sortReportTypes(this.state.locationsByType);

    //create lables and data points
    let labels = []; //bar labels
    let incidentCnts = []; //bar lengths
    for (let i=0; i<reportArray.length; i++) {

      //create labels using the incident types from locationsByType object
      labels.push(reportArray[i][0])

      //create data points using length of each array in locationsByType object
      incidentCnts.push(reportArray[i][1].length);
    }

    return (
      //invoke BarChart component to create graph
      <div  className="chart-box">
         <BarChart graphTitle="Incidents by Types" 
                labels={JSON.stringify(labels)} 
                dataPoints={JSON.stringify(incidentCnts)} />
      </div>

    )
  }

  displayMostRecentThefts() {
    //display 3 sample theft report descriptions

    if ( JSON.stringify(this.state.reportsByType) === JSON.stringify({}) ) {
      return <div></div>      //no data to display
    }

    let theftReports=this.state.reportsByType["theft"]; 

    //sort by occurred_at date
    theftReports.sort(function(a, b) {
      return b.occurred_at - a.occurred_at;
    })

    //find 3 reports with media
    let theftImg=[];
    for (let i=0; i<theftReports.length; i++) {
      if (theftReports[i].media === undefined) {   //skip reports without media
        continue;
      }
      if (theftReports[i].media.image_url !== null) {

        theftImg.push(  {bikeImg: theftReports[i].media.image_url,
                         reportTitle: theftReports[i].title });

        if ( theftImg.length >= 3 ) {   //only need 3 reports
          break;
        }
      }     
    }

    return (
      <div className="bike-img-row">

        {/* invoke ImageRow componenet to display image and text */}
        <ImageRow imgObjList={JSON.stringify(theftImg)} />

      </div>
    )
  }

  createQueryURL( FilterObj, queryPrefix ) {
    
    //Default URL:
    // https://bikewise.org:443/api/v2/incidents?page=1&proximity=Dallas%2C%20TX&proximity_square=100
    // "https://bikewise.org:443/api/v2/locations?proximity=Austin%2C%20TX&proximity_square=100&limit=10";

    //Default filter values
    let cityState=this.state.cityState;
    // let zip=this.state.zip;
    let proximity_sq=this.state.proximity_sq;
    let keyword=this.state.keyword;

    //fill in custom filter values
    if ( FilterObj !== undefined ) {
      cityState=FilterObj.city;
      // zip=FilterObj.zip;
      proximity_sq=FilterObj.proximity_sq;
      keyword=FilterObj.keyword
    }

    if ( queryPrefix === undefined ) {

      //API for incident report details
      queryPrefix = "https://bikewise.org:443/api/v2/incidents?page=1";
    }

    let queryURL =  queryPrefix+"&proximity="+cityState+"&proximity_square="+proximity_sq;

    if (keyword.length !== 0) {
      queryURL += "&query=" + keyword;
    }

    //substitutue space and comma in query (e.g. cityState, incidentType)
    queryURL=queryURL.replace(/ /g, "%20");
    queryURL=queryURL.replace(/,/g, "%2C");

    return queryURL;    
  }

  createMultipleURLs ( FilterObj ) {

    //create an API request for each report type
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

  simultaneousRequests(urls) {
    //get detailed reports of all incident types

    this.setState( { response : []}); //clear previous data

    //launch a few ajax request simultaneously using Promise.all
    Promise.all(urls.map((url)=>
      axios.get(url)
      .then (response=> {
        let resp=response.data.incidents;
        //console.log('new resp is in simultaneous mode--->', resp);

        let arr=this.state.response;
        arr = arr.concat(resp);
  
        this.setState({response: arr});   

        this.listReportsByType(arr);

      })
      .catch(error=>{
        //console.log('there is an error', error)
      })
    )) 
  }

  //query using the filters specified by user on the Filter form
  customQuery( FilterObj ) {
    
    // empty locationsByType and reportsByType
    this.initStateDataByType(); 

    this.getBikeWiseData(FilterObj);    //query report data

    let urls=this.createMultipleURLs( FilterObj );   //query report details
    this.simultaneousRequests(urls); 

  }

  componentDidMount() {

    this.getBikeWiseData();      //report data

    let urls=this.createMultipleURLs(  );  
    this.simultaneousRequests(urls);  

  }

  setContainerOnDisplay(container) {   //Do not cause render
    this.state.containerOnDisplay = container;   
  }

  swapContainerOnDisplay(toContainerId, inputProps) {   

    //turn off display of "from container" in props. display "to container" instead

    if (inputProps === undefined) { 
      //Came in from direct React component call instead of Router. No need to swap display

      this.setContainerOnDisplay(toContainerId); //just save the to container and return
      return;
    }

    //Look for the container element to be swapped from
    let fromContainerId=this.state.containerOnDisplay;
    let fromContainerElem=null;
    if (fromContainerId !== ""  &&  fromContainerId !== toContainerId) {
        fromContainerElem = document.getElementById(fromContainerId);
        if (fromContainerElem !== null) {

            document.getElementById(fromContainerId).style.display="none";
        }
    }

    //display to container
    let toContainerElem=document.getElementById(toContainerId);
    if (toContainerElem === null) {

      return;   //cannot find to container

    } else {
      
      //display to container
      document.getElementById(toContainerId).style.display="";
      this.setContainerOnDisplay(toContainerId); //save the to container 

    }
  }

  async getZipData( feature ) {

    //API for finding zip code
    let geocodesAPIKey=config.REACT_APP_BIG_DATA_CLOUD_KEY;

    let longitude=feature.geometry.coordinates[0];  let latitude=feature.geometry.coordinates[1]; 
    let queryURL=
      `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${geocodesAPIKey}`

    try {
      const response=await axios.get(queryURL);
      //console.log("reverse geocodes response:", response.data.postcode);

      let zipObj={ id:        feature.properties.id,
                 type:        feature.properties.type,
                 zip:         response.data.postcode,
                 longitude:   longitude,
                 latitude:    latitude
               };

      this.insertZipObjByType(zipObj);

    } catch (e) {
      console.error(e);
    }
  }

  async getBikeWiseData( FilterObj ) {
    //get a large amount of reports and locations. chained to 2nd API to get zip code info

    const limit=50;
    let queryPrefix=`https://bikewise.org:443/api/v2/locations?limit=${limit}`

    let queryURL = this.createQueryURL( FilterObj, queryPrefix );
    try {
      const response=await axios.get(queryURL);
      //console.log("Bikewise report response:", response.data.features);

      this.setState({locations: response.data.features})

      //chained request to Reverse Geocodes lookup API to get zip code from coordinates
      response.data.features.map(this.getZipData);

    } catch (e) {
      console.error(e);
    }
  }

  navBar() {
    return (
      <div>
        <Router>
            <nav className="menu">
              <ul className="menu-bar">
                <li>
                  <Link to="/Home">Home</Link>
                </li>

                <li>
                  <Link to="HazardSort">Hazard Reports</Link>
                </li>

                <li>
                  <Link to="/TheftSort">Theft Reports</Link>
                </li>

                <li>
                  <Link to="/UnconfirmedSort">Unconfirmed Reports</Link>
                </li>

                <li>
                  <Link to="/ZipCodes">All Reports</Link>
                </li>

                <li>
                  <Link to="/Filters">Filters</Link>
                </li>

              </ul>

              {/* <p className="city-proximity"> { this.props.proximity } </p> */}
              <p className="city-proximity"> { this.props.filter.city !== undefined ? this.props.filter.city 
                                                                        :  this.state.cityState } </p>

            </nav>

            <h2 className="logo-line">Bike Safety</h2>

            <Routes>
              <Route path="/Home" element=<Home
                    swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

              <Route path="/HazardSort" element=<HazardSort
                  getLocationsByTypeCallback = {this.getLocationsByType}
                  getReportsByTypeCallback = {this.getReportsByType}
                  swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

              <Route path="/TheftSort" element=<TheftSort
                  getLocationsByTypeCallback = {this.getLocationsByType}
                  getReportsByTypeCallback = {this.getReportsByType}
                  swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

              <Route path="/UnconfirmedSort" element=<UnconfirmedSort
                    getLocationsByTypeCallback = {this.getLocationsByType}
                    getReportsByTypeCallback = {this.getReportsByType}
                    swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

              <Route path="/ZipCodes" element=<ZipCodes
                    getLocationsByTypeCallback = {this.getLocationsByType}
                    getReportsByTypeCallback = {this.getReportsByType}
                    swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

              <Route path="/Filters" element=<Filters
                    customQueryCallback = {this.customQuery}
                    swapDisplayCallback = {this.swapContainerOnDisplay}
              /> />

            </Routes>
        </Router>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
      
        {this.navBar()}

        <Router>
          <Navigate to='/Home' />  
        </Router>

        <div id="home-container">
          {this.graphIncidentTypes()}
          {this.displayMostRecentThefts()}

        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return {

    filter: state.filter

  };
}

export default connect(mapStateToProps)(App);
