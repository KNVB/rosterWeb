import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function FillEmptyShiftWithOButton(){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    function fillEmptyShiftWithO(){
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let monthLength=contextValue.monthlyCalendar.calendarDateList.length;
        
        Object.keys(temp).forEach(itoId=>{
            let shiftList=temp[itoId].rosterList.shiftList;
            for (let i=0;i<monthLength;i++){
                if ((shiftList[i+1]===undefined)||(shiftList[i+1]==="")){
                    shiftList[i+1]="O";
                }
            }
        });
        contextValue.rosterData.set(temp);
        updateContext({type:'updateRosterData',value:contextValue.rosterData});
    }
    return(
        <div className="fillEmptyShiftWithOButton" onClick={fillEmptyShiftWithO}>
            Fill empty shift with "O"
        </div>
    )
}