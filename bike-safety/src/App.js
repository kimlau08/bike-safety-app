import React, { Component } from 'react';
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';

import Home from './components/Home';
import HazardSort from './components/HazardSort';
import TheftSort from './components/TheftSort';
import CrashSort from './components/CrashSort';
import ZipCodes from './components/ZipCodes';
import Filters from './components/Filters';
import { findAllInRenderedTree } from 'react-dom/test-utils';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      response: [],
      axiosDataLoaded: false,

      currentLocation: "Austin, TX", //city or zip

      //default query parms
      resultPage:   2,
      cityState:    "Austin, TX",
      zip:           "",
      proximity_sq:  100,
      keyword:       ""

    }

    this.getBikeWiseData=this.getBikeWiseData.bind(this);
    this.customQuery=this.customQuery.bind(this);
    this.navBar=this.navBar.bind(this);

    this.createQueryURL=this.createQueryURL.bind(this);
    this.createMultipleURLs=this.createMultipleURLs.bind(this);
  }

 
  sortReportsByType () {

    // let reports = {
    //   "crash" : [], 
    //   "hazard": [], 
    //   "theft":  [],
    //   "unconfirmed" : [],
    //   "infrastructure_issue": [],
    //   "chop_shop" : [] 
    // };

    let reports={}
    let resp=this.state.response;
    for (let i=0; i<resp.length; i++) {
      if ( resp[i].type in reports )  {

        reports[resp[i].type].push(resp[i])   //save report

      } else {

        //first report of that type. Start with an array of 1 elem
        Object.assign(  reports, { [ resp[i].type ] : [ resp[i] ]} ) 
        
      }
    }
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

    //substitutue space and comma in cityState
    cityState.replace(/ /g, "%20");
    cityState.replace(/,/g, "%2C");

    let queryURL =  "https://bikewise.org:443/api/v2/incidents?page="+resultPage+"&proximity="+cityState+"&proximity_square="+proximity_sq;

    if (keyword.length != 0) {
      queryURL += "&query=" + keyword;
    }

    return queryURL;    
  }

  createMultipleURLs ( FilterObj ) {

    let reportTypes = [
      "crash",
      "hazard",
      "theft",
      "unconfirmed",
      "infrastructure_issue",
      "chop_shop"
    ];

    let url=this.createQueryURL( FilterObj );
    let urls=[];
    for ( let i=0; i<reportTypes.length; i++) {

      urls.push(url + "&incident_type=" + reportTypes[i]);

    }
    return urls;
  }

  async getBikeWiseData( FilterObj ) {

    let queryURL = this.createQueryURL( FilterObj );
    try {
      const response=await axios.get(queryURL);
      console.log("getHTTP response:", response.data.incidents);

      this.setState({response: response.data.incidents})

      this.sortReportsByType(response);

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

        this.sortReportsByType(arr);

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


      </div>
    );
  }
}

