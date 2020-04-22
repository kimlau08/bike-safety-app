import React, { Component } from 'react';
import './App.css';

import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';

import Home from './components/Home';
import HazardSort from './components/HazardSort';
import TheftSort from './components/TheftSort';
import CrashSort from './components/CrashSort';
import ZipCodes from './components/ZipCodes';
import Filters from './components/Filters';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      response: [],
      axiosDataLoaded: false,

      currentProximity: "Dallas, TX", //city or zip

      //default query parms
      resultPage:   1,
      city:         "Dallas",
      cityState:    "TX",
      proximity_sq:  100

    }

    this.getBikeWiseData=this.getBikeWiseData.bind(this);
    this.navBar=this.navBar.bind(this);
  }

  

  getBikeWiseData() {
    axios.get("https://bikewise.org:443/api/v2/incidents?page=1&proximity=Dallas%2C%20TX&proximity_square=100")
    .then (response=> {
      const incidents=response.data.incidents;
      console.log('bikewise response', incidents);

      this.setState({response: incidents,
                     axiosDataLoaded: true})
    })
    .catch(error=>{
      console.log('there is an error', error)
    })
  }


  componentDidMount() {

    this.getBikeWiseData();

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

                <li>  <Link to="/Filters">Filters</Link> </li>
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

      </div>
    );
  }
}

