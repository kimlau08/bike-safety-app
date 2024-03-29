import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';

import setFilter from '../actions/index';

class Filters extends Component {
    constructor(props) {
        super(props);

        this.state={


            //Filter parameters
            cityState:    "Houston, TX",
            zip:           "",
            proximity_sq:  100,
            keyword:       "",

            redirectToHome: false        }


        this.handleCityStateChange=this.handleCityStateChange.bind(this);
        this.handleZipChange=this.handleZipChange.bind(this);
        this.handleProximitySqChange=this.handleProximitySqChange.bind(this);
        this.handleKeywordChange=this.handleKeywordChange.bind(this);
        this.handleQueryForm=this.handleQueryForm.bind(this);

        this.rdxsetFilter=this.rdxsetFilter.bind(this);

    }

    rdxsetFilter( filter ) {
        this.props.dispatch( setFilter(filter));
    }

    handleCityStateChange(event) {
        if (event.target !== undefined) {

            this.setState({cityState: event.target.value}); 
        }
    }
    handleZipChange(event) {
        if (event.target !== undefined) {

            this.setState({zip: event.target.value}); 
        }
    }
    handleProximitySqChange(event) {
        if (event.target !== undefined) {

            this.setState({proximity_sq: event.target.value}); 
        }
    }
    handleKeywordChange(event) {
        if (event.target !== undefined) {

            this.setState({keyword: event.target.value}); 
        }
    }
    handleQueryForm(event) {

        if (event.target.elements === undefined) {
            return;
        }

        let filterObj={};
        for (let i=0; i<event.target.elements.length; i++) {
            let elem=event.target.elements[i];
            if (elem.type !== "text" && elem.type !== "number") {
                continue;
            }

            let keyValue={ [elem.name]: elem.value  }
            //merge key:value pair to userObj
            Object.assign(filterObj, keyValue);

        }

        event.preventDefault();

        if ( (filterObj.city === "" && filterObj.zip === "") ||
             (filterObj.city !== "" && filterObj.zip !== "")) {
            document.getElementById('form-error-msg').innerHTML="Please enter either a city or zip"
        } else {

            if (filterObj.zip !== "") {
                filterObj.city = filterObj.zip;  //proximity filter takes either city or zip
            }

            //dispatch update of filter object
            this.rdxsetFilter(filterObj);

            //launch query
            this.props.customQueryCallback(filterObj);

            //Redirect back to root (App component)
            this.setState( { redirectToHome: true } ); 
            
            //swap back to the Home component display before redirect
            this.props.swapDisplayCallback("home-container", this.props);
        }
    }

    render() {

        if (this.props.customQueryCallback === undefined) {
            return <div></div>    //no callback to make query
        }

        let toContainerId="filter-container";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by filter form if redirecting away 
            
            this.props.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Navigate to='/Home' />    //route back to root (App component) depending on state
                }


                <form className="filter-form-container" onSubmit={this.handleQueryForm}>
                    
                    <p  className="fitler-title">Filters</p>

                    <label className="city-input">
                        City
                        <input className="input-field" type="text" name="city" value={this.state.cityState} placeholder="Enter City, State" onChange={this.handleCityStateChange} />
                    </label>

                    <label className="zip-input">
                        Zip
                        <input className="input-field" type="text" name="zip" value={this.state.zip} placeholder="Enter Zip" onChange={this.handleZipChange} />
                    </label>

                    <label className="distance-input">
                        Proximity
                        <input className="input-field" type="number" name="proximity_sq" value={this.state.proximity_sq} placeholder="Enter Distance" onChange={this.handleProximitySqChange} />
                    </label>

                    <label className="keyword-input">
                        Keyword
                        <input className="input-field" type="text" name="keyword" value={this.state.keyword} placeholder="Enter Text" onChange={this.handleKeywordChange} />
                    </label>

                    <p  id="form-error-msg"></p>

                    <button type="Search" className="search-button">Search</button>

                </form>
            </div>
        )
    }
}



function mapStateToProps(state) {
    return {
    
      filter: state.filter
  
    };
  }
  
  export default connect(mapStateToProps)(Filters);
  