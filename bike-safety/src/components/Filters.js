import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state={


            //Filter parameters
            cityState:    "Austin, TX",
            zip:           "",
            proximity_sq:  100,
            keyword:       "",

            redirectToHome: false        }


        this.handleCityStateChange=this.handleCityStateChange.bind(this);
        this.handleZipChange=this.handleZipChange.bind(this);
        this.handleProximitySqChange=this.handleProximitySqChange.bind(this);
        this.handleKeywordChange=this.handleKeywordChange.bind(this);
        this.handleQueryForm=this.handleQueryForm.bind(this);

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
            if (elem.type !== "text" && elem.type != "number") {
                continue;
            }

            let keyValue={ [elem.name]: elem.value  }
            //merge key:value pair to userObj
            Object.assign(filterObj, keyValue);

        }

        event.preventDefault();

        if (filterObj.city === "" && filterObj.zip === "" ) {
            document.getElementById('formErrorMsg').innerHTML="Please enter a city or zip"
        } else {


            //launch query
            this.props.location.customQueryCallback(filterObj);

            //Redirect back to root (App component)
            this.setState( { redirectToHome: true } ); 
        }
    }


    componentDidMount() {
        
        this.setState(this.state); //re-render to clear the Home component display
    }

    render() {

        if (this.props.location.customQueryCallback === undefined) {
            return <div></div>    //no callback to make query
        }

        return (
            <div id="FilterContainer">
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }


                <form className="FilterFormContainer" onSubmit={this.handleQueryForm}>
                    
                    <p  className="FilterTitle">Filters</p>

                    <label className="cityInput">
                        City
                        <input className="textInput" type="text" name="city" value={this.state.cityState} placeholder="Choose City, State" onChange={this.handleCityStateChange} />
                    </label>

                    <label className="zipInput">
                        Zip
                        <input className="textInput" type="text" name="zip" value={this.state.zip} placeholder="Enter Zip" onChange={this.handleZipChange} />
                    </label>

                    <label className="distanceInput">
                        Proximity
                        <input className="numberInput" type="number" name="proximity_sq" value={this.state.proximity_sq} placeholder="Enter Distance" onChange={this.handleProximitySqChange} />
                    </label>

                    <label className="keywordInput">
                        Keyword
                        <input className="textInput" type="text" name="keyword" value={this.state.keyword} placeholder="Enter Text" onChange={this.handleKeywordChange} />
                    </label>

                    <p  id="formErrorMsg"></p>

                    <button type="Search" className="searchButton">Search</button>

                </form>
            </div>
        )
    }
}

