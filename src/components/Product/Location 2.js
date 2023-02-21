import React, { useState } from 'react';
import "../App/App.css"
import TableData from '../table/form';
import 'realtime-trains-scraper';
import { originStation } from './InputLocation';

export let trO;
export let trD;


const realtimeTrains = require('realtime-trains-scraper');

export var first_function = function() {
  console.log("Entered first function");
  let t = realtimeTrains.getTrains(originStation);
  return new Promise(resolve => {
      setTimeout(function() {
      resolve(t);
      console.log("Returned first promise");
      }, 1);
  });
  };

export var async_function = async function() {
  console.log('async function called');

  const first_promise= await first_function();
  console.log("After awaiting for 2 seconds," +
  "the promise returned from first function is:");
  //console.log(JSON.stringify(first_promise));
  console.log(first_promise);
  if (first_promise == ""){
    alert('Results not found, please try another station.');
  }

  trO = "";
  trD = "";

  
  for (let i = 0; i < 15; i++){
    if (first_promise[i] != " " && first_promise[i] != undefined){
      trO += first_promise[i].origin["name"] + ", "
      trD += first_promise[i].destination["name"] + ", "
    }

  }
  

  //trO = first_promise[0].origin["name"] +", "+ first_promise[1].origin["name"] +", "+ first_promise[2].origin["name"]+", "+ first_promise[3].origin["name"]+", "+ first_promise[4].origin["name"]+", "+ first_promise[5].origin["name"];
  //trD = first_promise[0].destination["name"]+", "+ first_promise[1].destination["name"] +", "+ first_promise[2].destination["name"]+", "+ first_promise[3].destination["name"]+", "+ first_promise[4].destination["name"]+", "+ first_promise[5].destination["name"];

  console.log(trO);
  console.log(trD);

  trO = trO.split(',');
  trD = trD.split(',');
  //alert(trO[4]);

  //alert('Results Loaded');


}

async_function();

