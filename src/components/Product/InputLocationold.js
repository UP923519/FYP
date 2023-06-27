import React, { Component,useEffect, useRef, useState } from "react";
import { async_function, trD, trO, trC, trcDropDown} from "./Location 2";
import { getShowDistance } from "./Location 2";
//import CallingPoints from "./callingPoints";
import Select from 'react-select';
import { stCoord } from "./LocationCalcDIstance";
import { GetMiles } from "./GetMiles";
import LoadingIcons from 'react-loading-icons'
import { Puff } from 'react-loading-icons';




export let originStation;
const currDateTime =  new Date().toLocaleDateString('en-ca')+'T'+new Date().toLocaleTimeString();


let listStation = "";
let stationsList = "";

export class InputLocation extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {value: '', trD: trD, date: '',showHideLD: false,showHideErr: false, trcStations: '', dropVal: ''};
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleChangeDate = this.handleChangeDate.bind(this);

    this.getStation = this.getStation.bind(this);
    this.getStationList = this.getStationList.bind(this);

    this.getStation();

  }


  handleChange(event) {
    this.setState({value: event.target.value});
    setTimeout(
      function() {
        this.setState({value: event.target.value, trD: trD});
      }
      .bind(this),
      1
    );
    setTimeout(
      function() {
        this.setState({value: event.target.value, trD: trD});
      }
      .bind(this),
      1
    );
    setTimeout(
    function() {
        this.setState({value: event.target.value, trD: trD});
      }
      .bind(this),
      1
    );
  }

  handleChangeDate(event) {
    this.setState({trD, date: event.target.value});

  }

  handleSubmit(selectedStation) {
    //event.preventDefault();
    console.log("SS is", selectedStation);
    this.setState({trD: ""});
    this.setState({showHideLD: !this.state.showHideRail});
    originStation = selectedStation;
    let date = this.state.date;
    let date1Year = date.slice(0,4);
    let date1Month = date.slice(5,7);
    let date1Day = date.slice(8,10);
    let date1Time = date.slice(11,date.length);
    date = date1Day + "/" + date1Month + "/" + date1Year + " " + date1Time + ":00";
    //alert(date);

    async_function(date);
    let i = 2;

    var startTime = Date.now();
    while ((Date.now() - startTime) < 5000) {
      console.log(this.state.trD);

      this.setState({value: selectedStation, trD: trD});
      this.setState({showHideLD: this.state.showHideRail});
      if (trD == "Enter a station above to view destinations" || this.state.trD == ""){
        this.setState({showHideErr: true});
        console.log("is blank");
      } else {
        console.log("not blank");
        this.setState({showHideErr: false});
        break
      }
    }
    if (trD == "Enter a station above to view destinations" || this.state.trD == ""){
      this.setState({showHideErr: true});
      console.log("timed out");
    }
        
    
  }


  async getStation() {
    const response = await fetch('https://huxley2.azurewebsites.net/crs');
    const data = await response.json();
    listStation = data;
    let t = this.getStationList();
    ////console.log("t is", t);
    stationsList = JSON.stringify(t);
  }


  getStationList(){
    ////console.log(listStation);
    let listOfStations = []
    for (let i=0;i<listStation.length;i++){
      listOfStations.push(listStation[i].stationName + " ("+ listStation[i].crsCode + ")");
    }

    const display = listOfStations.map(opt => ({ label: opt, value: opt })); 
    
    this.setState({trcStations: <Select options={display} onChange={opt => (console.log("Selected",opt.value.slice(opt.value.length0,-6)) + this.setState({dropVal: opt.value.slice(opt.value.length-4,-1)})) + this.handleSubmit(opt.value.slice(opt.value.length0,-6))}/>});
    


  } 

  render() {
    const {showHideLD, showHideErr, trcStations} = this.state;
    return (
        <div className = "divRailInput">
          <div>
            <h3 style={{textAlign: "center"}}>National Rail Input</h3>
          <form onSubmit={this.handleSubmit}>
            <label>
            &nbsp;Date of travel{" "}<br/>
            &nbsp;<input style = {{backgroundColor: "#cfcfcf", border: "0", borderRadius: "2px"}} type="datetime-local" value={this.state.date} max={currDateTime} onChange={this.handleChangeDate} />
            <br/><br/>
            &nbsp;Origin station{" "}<br/><br/>
            &nbsp;<input style = {{backgroundColor: "#cfcfcf", border: "0", borderRadius: "2px"}} type="text" value={this.state.value} onInput={this.handleChange} onFocus={this.handleChange}/>
            </label><br/>
            <br/>
            {trcStations}

            <input style = {{border: "0"}} id = "railSubmitButton" type="submit" value="☑ Submit" />
            {showHideLD && <Puff id = "puff1" stroke="#000000"/> }
            {showHideErr && "⚠️ Please try again later" }
            <p style={{fontWeight: "bold"}}>
            &nbsp;Destinations on this route:</p> <p style={{paddingLeft: "4px", textAlign: "center"}}>{/*trD*/}{this.state.trD}</p>
            <p style={{fontWeight: "bold"}}> &nbsp;Select your journey:</p>
            {trcDropDown}

            <br/>
          </form>
        </div>
      </div>

    );
  }
}