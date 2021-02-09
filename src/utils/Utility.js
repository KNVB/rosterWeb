class Utility{
    static calculateShiftStat(noOfWorkingDay,rosterData,shiftInfoList){
        var aShiftCount=0,actualWorkingHour=0.0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0;
		var	thisMonthHourTotal=0.0,thisMonthBalance=0.0,totalHour=0.0,actualNoOfWorkingDay=0;
        var result={};
        var shiftList=[];
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
}
export default Utility;