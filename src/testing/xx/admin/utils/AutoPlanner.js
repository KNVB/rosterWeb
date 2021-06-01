import AdminUtility from './AdminUtility';
import AdminShiftStatUtil from './AdminShiftStatUtil';
import ITOShiftStatUtil from './ITOShiftStatUtil';
export default class AutoPlanner{
    constructor(contextValue){
        this.maxNoOfShiftPerMonth=7;
        this.maxConsecutiveWorkingDay=contextValue.systemParam.maxConsecutiveWorkingDay;
        this.getResult=async(startDate,endDate,iterationCount)=>{
            let {getAllITOStat}=AdminShiftStatUtil();
            let {getITOStat}=ITOShiftStatUtil();
            let adminUtility = new AdminUtility(contextValue.changeLoggedInFlag);
            let allPreviousShiftList=contextValue.previousMonthShiftList;
            let essentialShiftTemplate=contextValue.activeShiftInfoList.essentialShift;
            let itoList=await adminUtility.getITOList(contextValue.rosterMonth.getFullYear(),contextValue.rosterMonth.getMonth()+1);
            let itoRosterList=contextValue.itoRosterList.presentValue;
            
            let resultantRosterList={} ;
            let tempVSCountList=[],tempSDList=[],tempRosterList=[];
            let generatedSD=[],i=0;
            
            for (i=0;i<iterationCount;i++){
                let newITORosterList=genResult(allPreviousShiftList,essentialShiftTemplate,itoList,itoRosterList,startDate,endDate);
                Object.keys(newITORosterList).forEach(itoId=>{
                    newITORosterList[itoId]=getITOStat(contextValue.activeShiftInfoList,contextValue.monthlyCalendar.noOfWorkingDay,newITORosterList[itoId]);
                })
                let allITOStat=getAllITOStat(contextValue.activeShiftInfoList,startDate,endDate,newITORosterList);
                if (!generatedSD.includes(allITOStat.avgStdDev)){
                    generatedSD.push(allITOStat.avgStdDev);
                    //console.log(allITOStat.vacantShiftList);
                    tempRosterList.push({
                        itoRosterList:newITORosterList,
                        avgStdDev:+allITOStat.avgStdDev,
                        vacantShiftCount:+Object.keys(allITOStat.vacantShiftList).length
                    });
                    //console.log("count="+i);
                }
            }
            //console.log(tempRosterList);
            tempRosterList.sort(sortByVacantShiftCount);
            let j=((tempRosterList.length>3)?3:tempRosterList.length);
            for (i=0;i<j;i++){
                tempVSCountList[i]=JSON.parse(JSON.stringify(tempRosterList[i]));
            }
            tempRosterList.sort(sortBySD);
            for (i=0;i<j;i++){
                tempSDList[i]=JSON.parse(JSON.stringify(tempRosterList[i]));
            }
            resultantRosterList={minSDList:tempSDList,minVSList:tempVSCountList};
            return resultantRosterList;
        }
        let genResult=(allPreviousShiftList,essentialShiftTemplate,itoList,itoRosterList,startDate,endDate)=>{
            let comparetor,dateIndex;
            let essentialShift,iTOAvailableShiftList,itoId,itoIdList,isAssigned;
            let preferredShift,previousShiftList,resultantRosterList={},resultantRoster={};
            for (dateIndex = startDate ; dateIndex <= endDate ; dateIndex++){
                essentialShift=essentialShiftTemplate;
                itoIdList=getShuffledItoIdList(Object.keys(itoList));
                for (let i=0;i<itoIdList.length;i++){
                    itoId=itoIdList[i];
                    if (resultantRosterList[itoId]){
                        resultantRoster=resultantRosterList[itoId];
                    } else {
                        resultantRoster={
                            availableShiftList:itoList[itoId].availableShiftList,
                            shiftList:{},
                            workingHourPerDay:itoList[itoId].workingHourPerDay
                        }
                    }
                    previousShiftList=getPreviousShiftList(allPreviousShiftList,dateIndex,itoId,resultantRoster);
                    //tempPreviousShiftList=JSON.parse(JSON.stringify(previousShiftList));
                    if (itoRosterList[itoId].preferredShiftList[dateIndex]){
                        preferredShift=itoRosterList[itoId].preferredShiftList[dateIndex];
                    }else {
                        preferredShift='';
                    }
                    switch (preferredShift){
                        case "o":
                            resultantRoster.shiftList[dateIndex]="O";
                            previousShiftList.shift();
                            previousShiftList.push("O");
                            break;
                        case "d" : 
                        case "d1":
                        case "d2":
                        case "d3":
                            resultantRoster.shiftList[dateIndex]=preferredShift;
                            previousShiftList.shift();
                            previousShiftList.push(preferredShift);
                            break;
                        default:
                            iTOAvailableShiftList=getITOAvailableShiftList(dateIndex,itoList[itoId],preferredShift, previousShiftList,resultantRoster.shiftList);
                            //console.log("date="+dateIndex+",itoId="+itoId+",availableShift="+iTOAvailableShiftList);
                            if ((essentialShift==='')||(iTOAvailableShiftList.length===0)){
                                resultantRoster.shiftList[dateIndex]="O";
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
                                        resultantRoster.shiftList[dateIndex]=iTOAvailableShiftList[j];
                                        previousShiftList.shift();
                                        previousShiftList.push(iTOAvailableShiftList[j]);
                                        isAssigned=true;
                                        break;
                                    }
                                }
                                if (!isAssigned){
                                    //	console.log(" O shift is assigned on day "+dateIndex);
                                    resultantRoster.shiftList[dateIndex]="O";
                                    previousShiftList.shift();
                                    previousShiftList.push("O");
                                }
                            }
                            break;
                    }
                    /*
                    console.log("====================");
					console.log("itoId="+itoId);
					console.log("date="+dateIndex);
					console.log("preferredShift="+preferredShift);
                    console.log('Assigned Shift='+resultantRoster.shiftList[dateIndex]);
                    */
                    //console.log(dateIndex,itoId,tempPreviousShiftList,resultantRoster.shiftList);
                    resultantRosterList[itoId]=resultantRoster;
                }
            }
            return resultantRosterList;
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
        let getPreviousShiftList=(allPreviousShiftList,dateIndex,itoId,resultantRoster)=>{
            let result=[];
            let startDate=dateIndex-contextValue.systemParam.maxConsecutiveWorkingDay;
            if (startDate > 0){
                //console.log(startDate,dateIndex,resultantRoster.shiftList);
                for (let i=startDate;i<dateIndex;i++){
                    result.push(resultantRoster.shiftList[i]);
                }
            }else{    
                let lastMonthIndex=contextValue.systemParam.maxConsecutiveWorkingDay+startDate-1;
                let previousMonthShiftList=allPreviousShiftList[itoId];
                for (let i=lastMonthIndex;i<contextValue.systemParam.maxConsecutiveWorkingDay;i++){
                    result.push(previousMonthShiftList[i]);
                }
                for (let i=1;i<dateIndex;i++){
                    result.push(resultantRoster.shiftList[i]);
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
        let sortByVacantShiftCount=(a,b)=>{
            let comparison = 0;
            if (a.vacantShiftCount > b.vacantShiftCount){
                comparison = 1;
            } else {
                if (b.vacantShiftCount>a.vacantShiftCount){
                    comparison = -1;
                }
            }
            return comparison;
        }
        let sortBySD=(a,b)=>{
            let comparison = 0;
            if (a.avgStdDev > b.avgStdDev){
                comparison = 1;
            } else {
                if (b.avgStdDev>a.avgStdDev){
                    comparison = -1;
                }
            }
            return comparison;
        }
    }
}