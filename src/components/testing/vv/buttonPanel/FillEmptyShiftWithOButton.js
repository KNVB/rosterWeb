import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import Roster from '../../../../utils/Roster';
export default function FillEmptyShiftWithOButton(){
    let {activeShiftInfoList,monthlyCalendar,rosterData,setRosterData} = useContext(RosterWebContext);
    function fillEmptyShiftWithO(){
        let temp=JSON.parse(JSON.stringify(rosterData));
        let rosterList=temp.rosterList;

        let monthLength=monthlyCalendar.calendarDateList.length;
        
        Object.keys(rosterList).forEach(itoId=>{
            let shiftList=rosterList[itoId].shiftList;
            for (let i=0;i<monthLength;i++){
                if ((shiftList[i+1]===undefined)||(shiftList[i+1]==="")){
                    shiftList[i+1]="O";
                }
            }
            Roster.calculateITOMonthlyStat(temp.rosterList[itoId],monthlyCalendar.noOfWorkingDay,activeShiftInfoList);
        });
        temp.duplicateShiftList=Roster.getDuplicateShiftList(monthlyCalendar,rosterList);
        setRosterData(temp);
    }
    return(
        <div className="fillEmptyShiftWithOButton" onClick={fillEmptyShiftWithO}>
            Fill empty shift with "O"
        </div>
    )
}