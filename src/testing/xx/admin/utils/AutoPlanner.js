import AdminUtility from './AdminUtility';
export default class AutoPlanner{
    constructor(contextValue){
        this.getResult=async(startDate,endDate)=>{
            let adminUtility = new AdminUtility(contextValue.changeLoggedInFlag);
            let allPreviousShiftList=contextValue.previousMonthShiftList;
            let essentialShift,iTOAvailableShiftList,itoIdList;
            let preferredShift,previousShiftList,resultantRoster={},resultantShiftList={};
            let itoList=await adminUtility.getITOList(contextValue.rosterMonth.getFullYear(),contextValue.rosterMonth.getMonth()+1);
            let itoRosterList=contextValue.itoRosterList.presentValue;            
            console.log(contextValue);
            this.maxNoOfShiftPerMonth=7;
            this.maxConsecutiveWorkingDay=contextValue.systemParam.maxConsecutiveWorkingDay;
            for (let dateIndex=startDate;dateIndex<=endDate;dateIndex++){
                essentialShift=contextValue.activeShiftInfoList.essentialShift;
                itoIdList=getShuffledItoIdList(Object.keys(itoList));
                for (let [key, itoId] of Object.entries(itoIdList)) {
                    previousShiftList=allPreviousShiftList[itoId];
                    if (resultantRoster[itoId]){
                        resultantShiftList=resultantRoster[itoId];
                    }else{
                        resultantShiftList={};
                    }
                    if (itoRosterList[itoId].preferredShiftList[dateIndex]){
                        preferredShift=itoRosterList[itoId].preferredShiftList[dateIndex];
                    }else {
                        preferredShift=''
                    }
                    console.log("====================");
					console.log("itoId="+itoId);
					console.log("date="+dateIndex);
					console.log("preferredShift=",preferredShift);

                    switch (preferredShift){
                        case "o":
                            resultantShiftList[dateIndex]="O";
                            previousShiftList.shift();
                            previousShiftList.push("O");
                            break;
                        case "d" : 
                        case "d1":
                        case "d2":
                        case "d3":
                            resultantShiftList[dateIndex]=preferredShift;
                            previousShiftList.shift();
                            previousShiftList.push(preferredShift);
                            break;    
                        default:
                            iTOAvailableShiftList=getITOAvailableShiftList(
                                dateIndex,
                                itoList[itoId],
                                preferredShift,
                                previousShiftList,
                                resultantShiftList
                            );
                            break;    
                    }
                    resultantRoster[itoId]=resultantShiftList;
					//console.log("itoId="+itoId+",resultantShiftList="+resultantShiftList);
					//console.log("====================");
                }
            }
            console.log(resultantRoster);
        }
        let getITOAvailableShiftList=(dateIndex,ito,preferredShift, previousShiftList,resultantShiftList)=>{
            let result=[];
            ito.availableShiftList.forEach(shift=>{
                if (isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,dateIndex,ito,shift)){
                    result.push(shift);
                }
            });
            return result;
        }
        let isThatShiftFormBlackListedShiftPattern=(ito,previousShiftList,thatShift)=>{
            let shiftPattern="",indices=[];
            previousShiftList.forEach(function(shift){
                shiftPattern+=shift+",";
            });
            shiftPattern+=thatShift;
            indices=ito.getBlackListedShiftPatternIndex(shiftPattern);
            if (indices.length>0){
                return true;
            } else {
                return false;	
            }
        }
        let isThatShiftOkForAssign=(resultantShiftList,previousShiftList,preferredShift,dateIndex,ito,thatShift)=>{
            let result=true;
            let tempValue=getTotalNoOfThatShiftAssigned(resultantShiftList,thatShift);
            if (tempValue>this.maxNoOfShiftPerMonth){
                console.log("tempValue="+tempValue);
                console.log(ito.itoId+","+dateIndex+","+thatShift+", cause over the max. no. of "+thatShift+" shift assigned in a month");
                result=false;
            }else {
                if (getNoOfConsecutiveWorkingDay(ito,previousShiftList,thatShift)>=this.maxConsecutiveWorkingDay){
                    result=false;
                } else {
                    if (isThatShiftFormBlackListedShiftPattern(ito,previousShiftList,thatShift)){
                        result=false;
                    }
                }
            }
            return result;
        }
        let getNoOfConsecutiveWorkingDay=(ito,previousShiftList,thatShift)=>{
            let count=0,finished=false;
            let shiftList=JSON.parse(JSON.stringify(previousShiftList));
            shiftList.push(thatShift);
            for (var i=0;i<shiftList.length;i++)
            {
                switch (shiftList[i])
                {
                    case "":
                    case "O":
                    case "d" : 
                    case "d1":
                    case "d2":
                    case "d3":
                            count=0;
                            break;
                    default:
                            count++;
                            break;		
                }
            }
            console.log(ito.itoId,previousShiftList,shiftList,thatShift,count,this.maxConsecutiveWorkingDay);
            return count;
        }
        let getShuffledItoIdList=(itoIdList)=>{
            return itoIdList.sort(() => Math.random() - 0.5);
        }
        let getTotalNoOfThatShiftAssigned=(resultantShiftList,thatShift)=>{
            let count=0;
            for (let [key, shift] of Object.entries( resultantShiftList)) {
                if (shift===thatShift)
                    count++;
            };            
            return count;
        }
    }
}