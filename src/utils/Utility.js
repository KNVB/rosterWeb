import {useContext} from 'react';
import RosterWebContext from '../RosterWebContext';

class Utility{
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
    static calculateShiftStat(noOfWorkingDay,rosterData,shiftInfoList){
        let aShiftCount=0,actualWorkingHour=0.0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0;
		let	thisMonthHourTotal=0.0,thisMonthBalance=0.0,totalHour=0.0,actualNoOfWorkingDay=0;
        let result={};
        let shiftList=[];
        totalHour=rosterData.workingHourPerDay*noOfWorkingDay;
        rosterData.shiftList.forEach(item=>{
            var shiftTypeList=item.shift.split("+");
            shiftList.push(item.shift);
            shiftTypeList.forEach(shiftType => {
                actualWorkingHour+=shiftInfoList[shiftType].duration;
                switch (shiftType)
                {
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
                        break            					
                }
            })
        })
        thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=rosterData.lastMonthBalance+thisMonthHourTotal;
        actualNoOfWorkingDay=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
        
        result.totalHour=totalHour.toFixed(2);
        result.lastMonthBalance=rosterData.lastMonthBalance.toFixed(2);
        result.actualHour=actualWorkingHour.toFixed(2);
		result.thisMonthHourTotal=thisMonthHourTotal.toFixed(2);
		result.thisMonthBalance=thisMonthBalance.toFixed(2);
		
		result.aShiftCount=aShiftCount;
		result.bxShiftCount=bxShiftCount;
		result.cShiftCount=cShiftCount;
        result.dxShiftCount=dxShiftCount;
        result.itoName=rosterData.itoName;
        result.itoPostName=rosterData.itoPostName
        result.noOfWorkingDay=actualNoOfWorkingDay;
        result.shiftList=shiftList;
        return result;
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
                        //console.log(response);
                        throw new Error(response.status); 
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
                onMouseOut={deHightLight}
                onMouseEnter={hightLight}>
                    {props.children}
            </BaseComponent>        
        )
    }
}
export default Utility;