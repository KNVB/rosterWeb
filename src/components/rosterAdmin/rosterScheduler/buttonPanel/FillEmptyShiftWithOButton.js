import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function FillEmptyShiftWithOButton(){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    function fillEmptyShiftWithO(){
        let temp=JSON.parse(JSON.stringify(contextValue.undoableRosterSchedulerList.presentValue));
        let monthLength=contextValue.monthlyCalendar.calendarDateList.length;
        
        Object.keys(temp.rosterList).forEach(itoId=>{
            let shiftList=temp.rosterList[itoId].shiftList;
            for (let i=0;i<monthLength;i++){
                if ((shiftList[i+1]===undefined)||(shiftList[i+1]==="")){
                    shiftList[i+1]="O";
                }
            }
        });
        contextValue.undoableRosterSchedulerList.set(temp);
        updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
    }
    return(
        <div className="fillEmptyShiftWithOButton" onClick={fillEmptyShiftWithO}>
            Fill empty shift with "O"
        </div>
    )
}