import {useContext} from 'react';
import Roster from '../../../../../utils/Roster';
import RosterWebContext from '../../../../../utils/RosterWebContext';

export default function ClearAllShiftDataButton(){
    let {activeShiftInfoList,monthlyCalendar,rosterData,setRosterData} = useContext(RosterWebContext);
    function clearAllShiftData(){
        let temp=JSON.parse(JSON.stringify(rosterData));
        let rosterList=temp.rosterList;
        /*
        console.log(JSON.stringify(rosterData));
        console.log("0temp="+JSON.stringify(temp.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("0org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("0current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
        */
        Object.keys(rosterList).forEach(itoId=>{
            let roster=rosterList[itoId];
            roster.shiftList={};
            temp.rosterList[itoId]=roster;
            Roster.calculateITOMonthlyStat(temp.rosterList[itoId],monthlyCalendar.noOfWorkingDay,activeShiftInfoList);
        });
        temp.duplicateShiftList=Roster.getDuplicateShiftList(monthlyCalendar,rosterList);
        
        /*
        console.log("1temp="+JSON.stringify(temp.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("1org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("1current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
        */
        setRosterData(temp);
    }
    return(
        <div className="clearAllButton" onClick={clearAllShiftData}>
            Clear All Shift Data
        </div>
    )
}