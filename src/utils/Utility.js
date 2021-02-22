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
    static calculateITOMonthlyStat(noOfWorkingDay, rosterData, shiftInfoList) {
        let actualWorkingHour = 0.0,
          thisMonthHourTotal = 0.0,
          thisMonthBalance = 0.0,
          totalHour = 0.0,
          actualNoOfWorkingDay = 0;
        let result = {};
        let shiftList = [];
        totalHour = rosterData.workingHourPerDay * noOfWorkingDay;
        rosterData.shiftList.forEach(item => {
          let shiftTypeList = item.shift.split("+");
          shiftList.push(item.shift);
          shiftTypeList.forEach(shiftType => {
            actualWorkingHour += shiftInfoList[shiftType].duration;
          });
        });
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
    static calculateShiftCount(shiftList) {
        let aShiftCount = 0,
          bxShiftCount = 0,
          cShiftCount = 0,
          dxShiftCount = 0;
    
        shiftList.forEach(item => {
          let shiftTypeList = item.shift.split("+");
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
                        switch(response.status){
                            case 401:alert("The user session has been expired, please login again.");
                                     sessionStorage.clear();
                                     return <Redirect to='/rosterWeb/admin/'  />
                                     break
                            default:
                                    throw new Error(response.statusText);
                        }
                        
                    }
                })
    }
    static getSystemParam(){
        return Utility.fetchAPI('/publicAPI/getSystemParam','GET');
    }
    static withCursor=BaseComponent => props => {
        let { setHightLightCellIndex,setHighLightRowIndex } = useContext(RosterWebContext);
        let deHightLight = e => {
            //props.setIstHightLightRow(false);
            setHightLightCellIndex(-1);
            setHighLightRowIndex();
        };
        let hightLight = e => {
            //console.log(e.target.cellIndex);
            //props.setIstHightLightRow(true);
            setHightLightCellIndex(e.target.cellIndex);
            setHighLightRowIndex({itoId:props.itoid,rowType:props.rowtype});
        };
        return(
            <BaseComponent {...props}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                    {props.children}
            </BaseComponent>        
        )
    }
    static withEditable = BaseComponent => props=>{
        return (
          <BaseComponent
            {...props}
            contentEditable={true}
            suppressContentEditableWarning={true}>
            {props.children}
          </BaseComponent> 
        )  
    };
}