import React, { Component,useEffect, useRef, useState } from "react";
import { async_function, trD, trO, trC, getLatBetween} from "./Location 2";
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

let liveDeparture = "";
let liveServices0 = []
let busDeparture = "";
let allData = "";

let serviceMessage = "";

let currentCRSCode;

let trcDropDown = '';

let date;

let displayServiceMessage = "";
let current = ""
let earlier = "?timeOffset=-120&timeWindow=120";
let earlier2 = "?timeOffset=-82&timeWindow=120";
let later = "?timeOffset=82&timeWindow=120";
let later2 = "?timeOffset=119&timeWindow=120";


var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;


let departuresList = "test";


let textInfo = "There are no messages";

let myArray = [];

export class InputLocation extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {value: '', trD: trD, date: '',showHideLD: false,showHideErr: false, trcStations: '', dropVal: '', formVal: '', liveServices: []};
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleChangeDate = this.handleChangeDate.bind(this);

    this.getStation = this.getStation.bind(this);
    this.getStationList = this.getStationList.bind(this);

    this.logJSONData = this.logJSONData.bind(this);
    this.logJSONData2 = this.logJSONData2.bind(this);

    this.getTrainDepartures = this.getTrainDepartures.bind(this);


    this.getStation();
    trcDropDown = '';

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

  handleSubmit(timeOffset, selectedStation) {
    //event.preventDefault();
    //console.log("SS is", selectedStation);
    this.setState({trD: "", liveServices:''});
    
    trcDropDown = '';

    this.setState({showHideLD: !this.state.showHideRail});
    this.setState({showHideErr: this.state.showHideErr});
    originStation = timeOffset;

    date = this.state.date;
    let date1Year = date.slice(0,4);
    let date1Month = date.slice(5,7);
    let date1Day = date.slice(8,10);
    let date1Time = date.slice(11,date.length);
    date = date1Day + "/" + date1Month + "/" + date1Year + " " + date1Time + ":00";
    //alert(date);

    let code = selectedStation;

    try{
      if (code != undefined){
        JSON.stringify(this.logJSONData(code,timeOffset));
        this.setState({formVal: code});

      } else {
        JSON.stringify(this.logJSONData(this.formVal,timeOffset));

      }
    } catch{
      JSON.stringify(this.logJSONData(this.formVal,timeOffset));
    }


    setTimeout(() => {
      //departuresList = stringDepartures2;
    
      //console.log("Returned first promise");
      //console.log("returned promise is", departuresList)
  
      myArray = departuresList.split("\"");
  
      myArray = myArray.filter((value, index) => !((index+1)%2));
      myArray.shift();
      
      if (myArray[myArray.length-1] != ""){
      textInfo = myArray[myArray.length-1];
      } else {
        textInfo = "There are no messages at this station";
      }

      textInfo = textInfo.replace(htmlRegexG, ' ');
  
      myArray = myArray.slice(0,-2);
  
      //setDepartures(myArray);  


      this.stringDepartures = myArray;
        }, "1000");
        
  }

  async logJSONData(stationName, timeOffset) {

    //console.log(stationName, "is stNAME");
    //console.log(currentCRSCode, "is ccrs");

    if (stationName == ""){
      stationName = currentCRSCode;
    }

    const response = await fetch('https://huxley2.azurewebsites.net/departures/'+timeOffset+'/150');
    const data = await response.json();
    
    allData = data;
    liveDeparture = data.trainServices;
    busDeparture = data.busServices;

    currentCRSCode = data.crs;

    if (liveDeparture == null && busDeparture != null){
      liveDeparture = data.busServices;
    }

    if (liveDeparture == null && busDeparture == null){
      liveDeparture = [];
    }


    displayServiceMessage = "";
    serviceMessage = data.nrccMessages;
    let t = this.getTrainDepartures();
    departuresList = JSON.stringify(t);
  }

  async logJSONData2(serviceID) {
    const response = await fetch('https://huxley2.azurewebsites.net/service/'+serviceID);
    const data = await response.json();

    let liveService;
    let liveService2;

       
    try{
        liveService = data.previousCallingPoints[0].callingPoint;
        
    }catch{
      console.log("CAUGHT ERROR");
      liveService = "";
    }

    try{
      liveService2 = data.subsequentCallingPoints[0].callingPoint;
    }catch{
      console.log("CAUGHT ERROR");
      liveService2 = "";
    }

    liveService = {...liveService, ...liveService2}

    //console.log ("serviceID is", serviceID);
    //console.log ("LiveService is", liveService);
    //console.log ("LiveServices is", this.liveServices);

    liveServices0.push(liveService);



   return({liveService})
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

  getTrainDepartures(stationName){

    //let data = logJSONData(stationName);
  
  
    let sIdArray = [];
    let stringDepartures = [];

    liveServices0 = [];
    //console.log(allData);
    for (let i = 0; i < (liveDeparture.length); i++) {
      sIdArray.push(liveDeparture[i].serviceID);
      stringDepartures.push(liveDeparture[i].std +" "+ liveDeparture[i].destination[0].locationName + " (from " + liveDeparture[i].origin[0].locationName +")  "+ liveDeparture[i].etd +"  p."+ liveDeparture[i].platform);
      this.logJSONData2(liveDeparture[i].serviceID);
    }

    setTimeout(() => {
      console.log ("adding services", liveServices0)

      console.log(liveServices0.length);

      let noData = '';
      try{
        console.log(Object.keys(liveServices0[0]).length);
      } catch{
        noData = true;
      }

      let test = [];
      for (let i=0; i < liveServices0.length; i++){
        for (let j=0; j < Object.keys(liveServices0[i]).length; j++){

          console.log(liveServices0[i][j].locationName + "")
          test.push(liveServices0[i][j].locationName + "");
        }

      }

      test.sort();

      test = [...new Set(test)];

      this.setState({liveServices: test})

      console.log("params. OriginStation = ", originStation, "date = ", date);

      const aquaticCreatures = test.map(opt => ({ label: opt, value: opt }));
      trcDropDown = <Select 
      options={aquaticCreatures}
      //onChange={opt => console.log("Selected",opt.value)}
      onChange={opt => console.log("Selected",opt.value)+getLatBetween(originStation + " station", opt.value + " station", "train", date)}
      />;

      this.setState({showHideLD: this.state.showHideRail});

      if (aquaticCreatures == undefined || aquaticCreatures == '' || noData == true){
        this.setState({showHideErr: !this.state.showHideErr});
      } else {
        this.setState({showHideErr: false});
        console.log("noError");
      }




        }, "1000");





  
    try{
      for (let i = 0; i < (serviceMessage.length); i++){
        displayServiceMessage += (serviceMessage[i].value);
      };
  
      displayServiceMessage=displayServiceMessage.replaceAll("\""," ");
      displayServiceMessage=displayServiceMessage.replaceAll("\n"," ");
      }
    catch{
    }
    //console.log("Data sent back says", stringDepartures, displayServiceMessage);  
    return({stringDepartures, displayServiceMessage})
  } 

  render() {
    const {showHideLD, showHideErr, trcStations, liveServices} = this.state;
    return (
        <div className = "divRailInput">
          <div>
            <h3 style={{textAlign: "center"}}>National Rail Input</h3>
          <form onSubmit={e => {e.preventDefault() ; this.handleSubmit(originStation)}}>
            <label>
            &nbsp;Date of travel{" "}<br/>
            &nbsp;<input style = {{backgroundColor: "#cfcfcf", border: "0", borderRadius: "2px"}} type="datetime-local" value={this.state.date} max={currDateTime} onChange={this.handleChangeDate} />
            <br/><br/>
            &nbsp;Origin station{" "}
            </label><br/>
            <br/>
            {trcStations}
            <br/>
            {showHideLD && <Puff id = "puff1" stroke="#000000"/> }
            {showHideErr && "⚠️ Please try again later" }

            <p style={{fontWeight: "bold"}}> &nbsp;Select your journey:</p>
            {trcDropDown}

            <br/>
          </form>
        </div>
      </div>

    );
  }
}