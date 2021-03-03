import {useContext} from 'react';
import { Redirect } from 'react-router-dom'
import RosterWebContext from '../RosterWebContext';

export default class Utility{
    static calculateMean(data){
        return data.reduce(function (a, b) {
            return Number(a) + Number(b);
        }) / data.length;
    }
    static calculateStdDev(data){
        let m =this.calculateMean(data);
	    return Math.sqrt(data.reduce(function (sq, n) {
	            return sq + Math.pow(n - m, 2);
	        }, 0) / (data.length - 1));
    }
    static calculateITOMonthlyStat(roster,noOfWorkingDay,activeShiftInfoList){
      roster.actualWorkingHour=0.0;
      roster.totalHour = roster.workingHourPerDay * noOfWorkingDay;
      Object.keys(roster.shiftList).forEach(date=>{
          let item=roster.shiftList[date];
          let shiftTypeList = item.split("+");
          
          shiftTypeList.forEach(shiftType => {
              if (activeShiftInfoList[shiftType]){
                roster.actualWorkingHour += activeShiftInfoList[shiftType].duration;
              }     
          });
          
      });
      if(roster.thisMonthHourTotal===undefined)
        roster.thisMonthHourTotal = roster.actualWorkingHour - roster.totalHour;
      roster.thisMonthBalance = roster.lastMonthBalance + roster.thisMonthHourTotal;
      roster.shiftCountList=this.calculateShiftCount(roster.shiftList);
      roster.actualNoOfWorkingDay =roster.shiftCountList.aShiftCount +roster.shiftCountList.bxShiftCount+roster.shiftCountList.cShiftCount +roster.shiftCountList.dxShiftCount;
    }
    /*
    static calculateITOMonthlyStat(noOfWorkingDay, rosterData, shiftInfoList) {
        let actualWorkingHour = 0.0,
          thisMonthHourTotal = 0.0,
          thisMonthBalance = 0.0,
          totalHour = 0.0,
          actualNoOfWorkingDay = 0;
        let result = {};
        let shiftList = {};
        totalHour = rosterData.workingHourPerDay * noOfWorkingDay;
        Object.keys(rosterData.shiftList).forEach(key=>{
          let item =rosterData.shiftList[key];
            let shiftTypeList = item.split("+");
            shiftTypeList.forEach(shiftType => {
              if (shiftInfoList[shiftType]){
                actualWorkingHour += shiftInfoList[shiftType].duration;
              }     
            });
          shiftList[key-1]=item;
        })
        let shiftCount = this.calculateShiftCount(rosterData.shiftList);
        thisMonthHourTotal = actualWorkingHour - totalHour;
        thisMonthBalance = rosterData.lastMonthBalance + thisMonthHourTotal;
        actualNoOfWorkingDay =
          shiftCount.aShiftCount +
          shiftCount.bxShiftCount +
          shiftCount.cShiftCount +
          shiftCount.dxShiftCount;
    
        result.totalHour = totalHour.toFixed(2);
        result.lastMonthBalance = rosterData.lastMonthBalance.toFixed(2);
        result.actualHour = actualWorkingHour.toFixed(2);
        result.thisMonthHourTotal = thisMonthHourTotal.toFixed(2);
        result.thisMonthBalance = thisMonthBalance.toFixed(2);
    
        result.aShiftCount = shiftCount.aShiftCount;
        result.bxShiftCount = shiftCount.bxShiftCount;
        result.cShiftCount = shiftCount.cShiftCount;
        result.dxShiftCount = shiftCount.dxShiftCount;
        result.itoName = rosterData.itoName;
        result.itoPostName = rosterData.itoPostName;
        result.noOfWorkingDay = actualNoOfWorkingDay;
        result.shiftList = shiftList;
        return result;
    }
    */
    static calculateShiftCount(shiftList) {
        let aShiftCount = 0,
          bxShiftCount = 0,
          cShiftCount = 0,
          dxShiftCount = 0;
        Object.keys(shiftList).forEach(key=>{
          let item=shiftList[key];
          let shiftTypeList = item.split("+");
          shiftTypeList.forEach(shiftType => {
            switch (shiftType) {
              case "a":
                aShiftCount++;
                break;
              case "b":
              case "b1":
                bxShiftCount++;
                break;
              case "c":
                cShiftCount++;
                break;
              case "d":
              case "d1":
              case "d2":
              case "d3":
                dxShiftCount++;
                break;
              default:
                break;
            }
          });
        });
        return {
          aShiftCount: aShiftCount,
          bxShiftCount: bxShiftCount,
          cShiftCount: cShiftCount,
          dxShiftCount: dxShiftCount
        };
      }
    static fetchAPI(url,method,getParams,postParams){
        if (getParams){
            const paramsObject = new URLSearchParams(getParams);
            const queryString = paramsObject.toString();  
            url+="?"+queryString;
        }
        url="/rosterWeb"+url;
        console.log("=======================");
        console.log("url="+url);
        console.log("method="+method);
        console.log("getParams="+getParams);
        console.log("postParams="+postParams);
        console.log("=======================");
        return fetch(url,
                {
                    body: JSON.stringify(postParams),
                    headers:{
                        'Content-Type': 'application/json' 
                    },
                    "method":method || 'GET',
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }else{
                      if (response.status===401){
                        alert("The user session has been expired, please login again.");
                        sessionStorage.clear();
                        return <Redirect to='/rosterWeb/admin/'  />
                      } else{
                          throw new Error(response.statusText);
                        }
                    }
                })
    }
    static getSystemParam(){
        return Utility.fetchAPI('/publicAPI/getSystemParam','GET');
    }    
}