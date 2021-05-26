import AdminUtility from './AdminUtility';
export default class AutoPlanner{
    constructor(contextValue){
        this.getResult=async(startDate,endDate)=>{
            let adminUtility = new AdminUtility(contextValue.changeLoggedInFlag);
            let allPreviousShiftList=contextValue.previousMonthShiftList;
            let comparetor,dateIndex;
            let essentialShift,iTOAvailableShiftList,itoIdList,isAssigned;
            let preferredShift,previousShiftList,resultantRoster={},resultantShiftList={};
            let itoId,itoList=await adminUtility.getITOList(contextValue.rosterMonth.getFullYear(),contextValue.rosterMonth.getMonth()+1);
            let itoRosterList=contextValue.itoRosterList.presentValue;            
            console.log(contextValue);
            this.maxNoOfShiftPerMonth=7;
            this.maxConsecutiveWorkingDay=contextValue.systemParam.maxConsecutiveWorkingDay;

            for (dateIndex = startDate ; dateIndex <= endDate ; dateIndex++){
                essentialShift=contextValue.activeShiftInfoList.essentialShift;
                itoIdList=getShuffledItoIdList(Object.keys(itoList));
                for (let i=0;i<itoIdList.length;i++){
                    itoId=itoIdList[i];
                    previousShiftList=getPreviousShiftList(itoId,dateIndex,itoRosterList,allPreviousShiftList[itoId]);
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
                            iTOAvailableShiftList=getITOAvailableShiftList(dateIndex,itoList[itoId],preferredShift, previousShiftList,resultantShiftList);
                            console.log("date="+dateIndex+",itoId="+itoId+",availableShift="+iTOAvailableShiftList);
                            if ((essentialShift==='')||(iTOAvailableShiftList.length===0)){
                                resultantShiftList[dateIndex]="O";
                                previousShiftList.shift();
                                previousShiftList.push("O");
                            }else{
                                isAssigned=false;
                                for (var j=0;j<iTOAvailableShiftList.length;j++){
                                    switch (iTOAvailableShiftList[j])
                                    {
                                        case "b1":
                                                comparetor="b";
                                                break;
                                        default:
                                                comparetor=iTOAvailableShiftList[j];
                                                break;
                                    }
                                    if (essentialShift.indexOf(comparetor)>-1){
                                        essentialShift=essentialShift.replace(comparetor,"");
                                        resultantShiftList[dateIndex]=iTOAvailableShiftList[j];
                                        previousShiftList.shift();
                                        previousShiftList.push(iTOAvailableShiftList[j]);
                                        isAssigned=true;
                                        break;
                                    }
                                }
                                if (!isAssigned)
                                {
                                //	console.log(" O shift is assigned on day "+dateIndex);
                                    resultantShiftList[dateIndex]="O";
                                    previousShiftList.shift();
                                    previousShiftList.push("O");
                                }
                            }
                            break;    
                    }
                    console.log("====================");
					console.log("itoId="+itoId);
					console.log("date="+dateIndex);
					console.log("preferredShift="+preferredShift);
                    console.log('Assigned Shift='+resultantShiftList[dateIndex]);
                    resultantRoster[itoId]=resultantShiftList;
                }
            }
            return resultantRoster;
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
        let getPreviousShiftList=(itoId,dateIndex,itoRosterList,previousMonthShiftList)=>{
            let result=[];
            let startDate=dateIndex-contextValue.systemParam.maxConsecutiveWorkingDay;
            if (startDate>0){
                for (let j=startDate;j<dateIndex;j++){
                    result.push(itoRosterList[itoId].shiftList[j]);
                }
            }else{
                let lastMonthIndex=contextValue.systemParam.maxConsecutiveWorkingDay+startDate-1;
                //console.log(startDate,lastMonthIndex,previousMonthShiftList);
                for (let i=lastMonthIndex;i<contextValue.systemParam.maxConsecutiveWorkingDay;i++){
                    result.push(previousMonthShiftList[i]);
                }
                for (let i=1;i<dateIndex;i++){
                    result.push(itoRosterList[itoId].shiftList[i]);
                }
            }
            return result;
        }
        let getNoOfConsecutiveWorkingDay=(previousShiftList,thatShift)=>{
            let count=0;
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
            //console.log(ito.itoId,previousShiftList,shiftList,thatShift,count,this.maxConsecutiveWorkingDay);
            return count;
        }
        let getShuffledItoIdList=(itoIdList)=>{
            return itoIdList.sort(() => Math.random() - 0.5);
        }
        let getTotalNoOfThatShiftAssigned=(resultantShiftList,thatShift)=>{
            let count=0;
            for (let [, shift] of Object.entries( resultantShiftList)) {
                if (shift===thatShift)
                    count++;
            };            
            return count;
        }        
        let isConflictWithPreferredShift=(preferredShift,thatShift)=>{
            let result=false;
            if (((typeof preferredShift)==="undefined") || (preferredShift==="")||(preferredShift===thatShift)){
                return result;
            }else {
                if (preferredShift.startsWith("n"))
                {
                    if (preferredShift.indexOf(thatShift)>-1)
                        result=true;
                }	
                else	
                {	
                    switch (thatShift)
                    {
                        case "O":
                        case "d" : 
                        case "d1":
                        case "d2":
                        case "d3":
                                break;
                        default:
                                result=true;
                                break;
                    }
                }
            }
            return result;
        }
        
        let isThatShiftFormBlackListedShiftPattern=(ito,previousShiftList,thatShift)=>{
            let shiftPattern="";
            previousShiftList.forEach(function(shift){
                shiftPattern+=shift+",";
            });
            shiftPattern+=thatShift;
            return ito.isBlackListedShiftPattern(shiftPattern);
        }
        let isThatShiftOkForAssign=(resultantShiftList,previousShiftList,preferredShift,dateIndex,ito,thatShift)=>{
            let result=true;
            let totalNoOfThatShiftAssigned=getTotalNoOfThatShiftAssigned(resultantShiftList,thatShift);
            let noOfConsecutiveWorkingDay=getNoOfConsecutiveWorkingDay(previousShiftList,thatShift);
            /*
            let thatShiftFormBlackListedShift=isThatShiftFormBlackListedShiftPattern(ito,previousShiftList,thatShift);
            let conflictWithPreferredShift=isConflictWithPreferredShift(preferredShift,thatShift);
           
            console.log("Total No. Of That Shift("+thatShift+") Assigned="+totalNoOfThatShiftAssigned);
            console.log("Total No. Of Consecutive Working Day="+noOfConsecutiveWorkingDay);
            console.log("Is That Shift("+thatShift+") Form BlackListed Shift Pattern="+thatShiftFormBlackListedShift);
            console.log("Is That Shift("+thatShift+") Conflict With Preferred Shift="+conflictWithPreferredShift);
            */
            if (totalNoOfThatShiftAssigned>this.maxNoOfShiftPerMonth){
                //console.log(ito.itoId+","+dateIndex+","+thatShift+", cause over the max. no. of "+thatShift+" shift assigned in a month");
                return false;
            }
            if (noOfConsecutiveWorkingDay>=contextValue.systemParam.maxConsecutiveWorkingDay){
                //console.log(ito.itoId+","+dateIndex+","+thatShift+", cause over the max. consecutive working day");
                return false;
            }
            if (isThatShiftFormBlackListedShiftPattern(ito,previousShiftList,thatShift)){
                //console.log(ito.itoId+","+dateIndex+","+thatShift+", form black list");
                return false;
            }
            if (isConflictWithPreferredShift(preferredShift,thatShift)){
                //console.log(ito.itoId+","+dateIndex+","+thatShift+",conflict with preferred("+preferredShift+").");
                return false;
            }
            
            return result;
        }
    }
}