import React, { Component } from 'react';
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import BarChart from './components/BarChart';
import Home from './components/Home';
import HazardSort from './components/HazardSort';
import TheftSort from './components/TheftSort';
import UnconfirmedSort from './components/UnconfirmedSort'
import ZipCodes from './components/ZipCodes';
import Filters from './components/Filters';
import ImageRow from './components/ImageRow';
import config from './config/config';


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
      locations: [],
      locationsAndZips: [],
      axiosDataLoaded: false,

      locationsByType: {},    //object of arrays, with geocodes, zip and type of reports
      reportsByType: {},      //objects of arrays of detailed reports
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
 //   this.getBikeWiseReports=this.getBikeWiseReports.bind(this);
    this.getZipData=this.getZipData.bind(this);
    this.customQuery=this.customQuery.bind(this);
    this.navBar=this.navBar.bind(this);

    this.createQueryURL=this.createQueryURL.bind(this);
    this.createMultipleURLs=this.createMultipleURLs.bind(this);

    this.stackReportsByType=this.stackReportsByType.bind(this);
    this.stackZipDataByType=this.stackZipDataByType.bind(this);
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

  initializeReportStacks() {

    let reports={}

    //initialize with all report types and empty arrays
    for (let i=0; i<reportTypes.length; i++) {
      Object.assign(  reports, { [ reportTypes[i].toLowerCase() ] : [ ]} ) 
    }

    return reports;
  }
  
  stackZipDataByType () {
    //group the report locations by report types

    if (this.state.locationsAndZips === undefined) {
      return; //no data
    }

    //create empty arrays of report types
    let locations = this.initializeReportStacks(); 

    let zipList=this.state.locationsAndZips;
    for (let i=0; i<zipList.length; i++) {
      if ( zipList[i].type.toLowerCase() in locations )  {

        locations[zipList[i].type.toLowerCase()].push(zipList[i])   //save report

      } else {

        //first report of that type. Start with an array of 1 elem
        Object.assign(  locations, { [ zipList[i].type.toLowerCase() ] : [ zipList[i] ]} ) 
        
      }
    }

    this.setState(  {locationsByType: locations}  )

  }

 
  stackReportsByType () {
    //group the reports by report types

    if (this.state.response === undefined) {
      return; //no data
    }

    //create empty arrays of report types
    let reports = this.initializeReportStacks(); 

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


  displayMostRecentThefts() {

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

        <ImageRow imgObjList={JSON.stringify(theftImg)} />

      </div>
    )
  }


  createQueryURL( FilterObj, queryPrefix ) {
    
    //Default URL:
    // https://bikewise.org:443/api/v2/incidents?page=1&proximity=Dallas%2C%20TX&proximity_square=100
    // "https://bikewise.org:443/api/v2/locations?proximity=Austin%2C%20TX&proximity_square=100&limit=10";


    
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

    if ( queryPrefix === undefined ) {
      queryPrefix = "https://bikewise.org:443/api/v2/incidents?page=1";
    }

    let queryURL =  queryPrefix+"&proximity="+cityState+"&proximity_square="+proximity_sq;

    if (keyword.length != 0) {
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

        this.stackReportsByType(arr);

      })
      .catch(error=>{
        //console.log('there is an error', error)
      })
    )) 
  }

  
  customQuery( FilterObj ) {

//    this.getBikeWiseReports(FilterObj); //recent report details
    this.getBikeWiseData(FilterObj);  //report data

let urls=this.createMultipleURLs( FilterObj );
this.simultaneousRequests(urls); 

  }

  componentDidMount() {

    
//    this.getBikeWiseReports();  //recent report details
    this.getBikeWiseData();      //report data

let urls=this.createMultipleURLs(  );
this.simultaneousRequests(urls);  

  }

  setContainerOnDisplay(container) {   //Do not cause render
    this.state.containerOnDisplay = container;   
  }

  swapContainerOnDisplay(toContainerId, inputProps) {   

    //turn on display of "from container" in props. display "to container" instead

    if (inputProps.location === undefined) { 
      //Came in from direct React component call instead of Router. No need to swap display

      this.setContainerOnDisplay(toContainerId); //just save the to container and return
      return;
    }

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

      let arr=this.state.locationsAndZips;
      arr.push(zipObj);

      this.setState({locationsAndZips: arr});

      this.stackZipDataByType(response);

    
    } catch (e) {
      console.error(e);
    }
  }


  async getBikeWiseData( FilterObj ) {
    //get a large amount of reports and locations. chained to 2nd API to get zip code info


    let limit=50;
    let queryPrefix="https://bikewise.org:443/api/v2/locations?"+`limit=${limit}`

    let queryURL = this.createQueryURL( FilterObj, queryPrefix );
    try {
      const response=await axios.get(queryURL);
      //console.log("Bikewise report response:", response.data.features);

      this.setState({locations: response.data.features})

      //chained to Reverse Geocodes lookup API to get zip code from coordinates
      this.setState({locationsAndZips: []})  //clear data before lookup
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
              <ul className="menuBar">
                <li>
                  <Link to={{
                      pathname: "/Home",
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Home</Link>
                </li>

                <li>
                  <Link to={{
                      pathname: "/HazardSort",
                      getLocationsByTypeCallback: this.getLocationsByType,
                      getReportsByTypeCallback : this.getReportsByType,
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Hazard Sort</Link>
                </li>

                <li>
                  <Link to={{
                      pathname: "/TheftSort",
                      getLocationsByTypeCallback: this.getLocationsByType,
                      getReportsByTypeCallback : this.getReportsByType,
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Theft Sort</Link>
                </li>

                <li>
                  <Link to={{
                      pathname: "/UnconfirmedSort",
                      getLocationsByTypeCallback: this.getLocationsByType,
                      getReportsByTypeCallback : this.getReportsByType,
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Unconfirmed Cases</Link>
                </li>

                <li>
                  <Link to={{
                      pathname: "/ZipCodes",
                      getLocationsByTypeCallback: this.getLocationsByType,
                      getReportsByTypeCallback : this.getReportsByType,
                      swapDisplayCallback: this.swapContainerOnDisplay,
                    }}>Zip Codes</Link>
                </li>

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

              <Route path="/UnconfirmedSort" component={UnconfirmedSort} />

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

        <div id="homeContainer">
          {this.graphIncidentTypes()}
          {this.displayMostRecentThefts()}

        </div>
      </div>

    );
  }
}

