import React from "react";
import StartFirebase from "../Preferences/firebase";
import {ref, onValue, query, limitToLast, orderByChild, orderByPriority, orderByValue } from "firebase/database";

import { Table } from "react-bootstrap";
import { TrendBarChart } from "./realTImeDataGraphs";
import { GraphEXP } from "./realTImeDataGraphsExp";


const db = StartFirebase();

let recordsTotal = 0;
let recordsTotalMonth = 0;
let recordsL = [];
export let graphArray = [];

export let tmode = "loading...";
export let tmodeTip = "loading...";
let tmodeTip2 = "";

            //DatePreviousMonth
            var date = new Date();
            date.setDate(date.getDate() - 30); 
            var dateString = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
            var displayDateString = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();

            //DatePreviousWeek
            var dateW = new Date();
            dateW.setDate(dateW.getDate() - 7); 
            var dateStringW = dateW.getFullYear() + '-' + ("0" + (dateW.getMonth() + 1)).slice(-2) + '-' + ("0" + dateW.getDate()).slice(-2);
            var displayDateStringW = ("0" + dateW.getDate()).slice(-2) + '-' + ("0" + (dateW.getMonth() + 1)).slice(-2) + '-' + dateW.getFullYear();

            //DatePreviousYear
            var dateY = new Date();
            dateY.setDate(dateY.getDate() - 365); 
            var dateStringY = dateY.getFullYear() + '-' + ("0" + (dateY.getMonth() + 1)).slice(-2) + '-' + ("0" + dateY.getDate()).slice(-2);
            
            //DateWeeBeforeLast
            var dateL2W = new Date();
            dateL2W.setDate(dateL2W.getDate() - 14); 
            var dateStringL2W = dateL2W.getFullYear() + '-' + ("0" + (dateL2W.getMonth() + 1)).slice(-2) + '-' + ("0" + dateL2W.getDate()).slice(-2);
            var displayDateStringL2W = ("0" + dateL2W.getDate()).slice(-2) + '-' + ("0" + (dateL2W.getMonth() + 1)).slice(-2) + '-' + dateL2W.getFullYear();


            //Date3WeeksAgo
            var dateL3W = new Date();
            dateL3W.setDate(dateL3W.getDate() - 21); 
            var dateStringL3W = dateL3W.getFullYear() + '-' + ("0" + (dateL3W.getMonth() + 1)).slice(-2) + '-' + ("0" + dateL3W.getDate()).slice(-2);
            var displayDateStringL3W = ("0" + dateL3W.getDate()).slice(-2) + '-' + ("0" + (dateL3W.getMonth() + 1)).slice(-2) + '-' + dateL3W.getFullYear();



export class RealTimeDataTotals extends React.Component{
    constructor(){
        super();
        this.state = {
            tableData: [],
            tmodeTip2: "loading..."
        }
    }

    componentDidMount(){
        const user2 = localStorage.getItem('username');
        //const dbref = ref(db, user2);
        const dbref = query(ref(db, user2), orderByChild("Amount"));

        onValue(dbref, (snapshot)=>{
            let records = [];
            graphArray = [];
            recordsTotal = 0;
            recordsTotalMonth = 0;
            let recordsTotalWeek = 0;
            let recordsTotalYear = 0;
            let recordsTotalL2W = 0;
            let recordsTotalL3W = 0;
            let recordsTotalL4W = 0;

            

            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({"date": keyName, "data":data})             
            });

            let tmodeT = 0;
            let tmodeC = 0;
            let tmodeB = 0;


            
            for (let i=0; i<records.length; i++){
                recordsTotal = recordsTotal + Number(records[i].data.Amount);
                let date1 = records[i].data.date.slice(0,-8).slice(0,-1);
                let date2 = dateString;
                let date1Day = date1.slice(0,2);
                let date1Month = date1.slice(3,5);
                let date1Year = date1.slice(6,10);
                date1 = date1Year + "-" + date1Month + "-" + date1Day;
                //console.log(date1, date2);
                //console.log(records[i].data.Transaction.slice(0,2));
                let transportMode = records[i].data.Transaction.slice(0,2);
                
                if (transportMode == "🚂"){
                    tmodeT += 1; 
                }
                if (transportMode == "🚗"){
                    tmodeC += 1; 
                }
                if (transportMode == "🚌"){
                    tmodeB += 1; 
                }
                               
                if (date1 > date2){
                    recordsTotalMonth = recordsTotalMonth + Number(records[i].data.Amount);
                    //console.log("newer than last month");
                }

                if (date1 >= dateStringW){
                    //console.log("The following date", date1, "should be bigger than", dateStringW, "Last week");
                    recordsTotalWeek = recordsTotalWeek + Number(records[i].data.Amount);
                    //console.log("newer than last week");
                }

                if (date1 >= dateStringY){
                    recordsTotalYear = recordsTotalYear + Number(records[i].data.Amount);
                    //console.log("newer than last year");
                }

                if (date1 >= dateStringL2W && date1 < dateStringW){
                    //console.log("The following date", date1, "should be less than", dateStringW, "and bigger than", dateStringL2W, "last 2 week");
                    recordsTotalL2W = recordsTotalL2W + Number(records[i].data.Amount);
                }

                if (date1 >= dateStringL3W && date1 < dateStringL2W){
                    //console.log("The following date", date1, "should be less than", dateStringL2W, "and bigger than", dateStringL3W, "last 3 week");
                    recordsTotalL3W = recordsTotalL3W + Number(records[i].data.Amount);
                }

                if (date1 > date2 && date1 < dateStringL3W){
                    //console.log("The following date", date1, "should be less than", dateStringL3W, "and bigger than", date2, "last 4 week");
                    recordsTotalL4W = recordsTotalL4W + Number(records[i].data.Amount);
                }
                //console.log (records[i].data.date.slice(0,-8));
                //console.log(dateString);
            }
            
            let dataArr = ["Amount: ", [recordsTotal, recordsTotalMonth, recordsTotalWeek, recordsTotalWeek]];
            records = [];

            records.push({date: 'n/a', data: {Amount: recordsTotalWeek, Transaction: 'This Week', date: 'N/A'}});
            graphArray.push({Amount: recordsTotalWeek, Transaction: displayDateStringW});
            graphArray.push({Amount: recordsTotalL2W, Transaction: displayDateStringL2W});
            graphArray.push({Amount: recordsTotalL3W, Transaction: displayDateStringL3W});
            graphArray.push({Amount: recordsTotalL4W, Transaction: displayDateString});

            records.push({date: 'n/a', data: {Amount: recordsTotalMonth, Transaction: 'This Month', date: 'N/A'}});
            records.push({date: 'n/a', data: {Amount: recordsTotalYear, Transaction: 'Past Year', date: 'N/A'}});
            records.push({date: 'n/a', data: {Amount: recordsTotal, Transaction: 'All time', date: 'N/A'}});

            //recordsL = ["All time", "This month"];
            graphArray = graphArray.reverse();

            this.setState({tableData: records});

            if (tmodeT > tmodeC && tmodeT > tmodeB){
                tmode = "Train travel is your preferred transport mode! You're making a positive impact on the environment."
                tmodeTip = "When you don't need to travel by train, consider cycling or walking to reduce your carbon footprint further."
            } else if (tmodeC > tmodeT && tmodeC > tmodeB){
                tmode = "Car travel is your preferred transport mode."
                tmodeTip = "Only travel by car if you really need to. How about learning to drive more efficiently? https://rb.gy/r8p6u"
            } else if (tmodeB > tmodeT && tmodeB > tmodeC){
                tmode = "Bus travel is your preferred method of transport! This is a great way to save emissions compared to travelling by car."
                tmodeTip = "For shorter journeys, are you able to cycle or walk more often to reduce your footprint further?"
            } else if (tmodeT == tmodeC && tmodeT == tmodeB){
                tmode = "You take the same amount of car journeys as train and bus journeys!"
                tmodeTip = "Try to reduce your car journeys and take the train and bus more often instead. "+
                "When you do need to drive, how about driving in a more environmentally friendly way? https://rb.gy/r8p6u"
            } if (tmodeT == 0 && tmodeC == 0 && tmodeB == 0){
                tmode = "Start adding journeys to recieve highlights"
                tmodeTip = "Recommendations will appear once you have added a journey"
            }

            //console.log("records iss", ((records)));
            //console.log("graphArray iss", ((graphArray)));

            //console.log("recordsTotal iss", (recordsTotal));
            //console.log("recordsTotalMonth iss", (recordsTotalMonth));
        });


        const dbrefT = query(ref(db, "tips"));
        let DBTips = [];
        onValue(dbrefT, (snapshot)=>{
          snapshot.forEach(childSnapshot => {
              let keyName = childSnapshot.key;
              let data = childSnapshot.val();
              DBTips.push({"date": keyName, "data":data})
              
          });
          let tipNo = Math.floor(Math.random() * DBTips.length);
          console.log(tipNo);
          tmodeTip2 = DBTips[tipNo].data;
          this.setState({tmodeTip2: DBTips[tipNo].data});

          console.log(DBTips[1].data);
        });
    }

    render(){
        return(
            <div className="wrapper">
                <h4>Your recent carbon balance</h4>
                <Table className= "transactions" style = {{backgroundColor: "#b4eced"}}>
                    <thead>
                    <tr>
                        {/*<th>#</th>*/}
                        <th>Time period</th>
                        <th>Carbon (CO2e)</th>
                        {/*<th>Date Time</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.tableData.map((row,index)=>{
                            return(
                            <tr>
                                {/*<td>{index}</td>*/}
                                {/*<td>{row.date}</td>*/}
                                <td>{row.data.Transaction}</td>
                                <td>{row.data.Amount}</td>
                                {/*<td>{row.data.date}</td>*/}
                            </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <TrendBarChart/>
                <div className='Wrapper2'>
                    {/*<Table data = {rows}></Table>*/}
                    <h4>Your highlights</h4>
                    <ul className = "highlights2">
                        <li className = "highlights">{tmode}</li>
                        <li className = "highlights">{tmodeTip}</li>
                    </ul>
                </div>
                <h4>Today's top tip</h4>
                <p id = "highlights2">{this.state.tmodeTip2}</p>

                <a href="/FYP">
                    <button style={{marginLeft:"0"}} id = "useCurrentLocation">
                        ↻ Refresh Page
                    </button> 
                </a>
               
            </div>

        )
    }


}