import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import RosterWebContext from '../../../utils/RosterWebContext';
import VVBody from './VVBody';
import useUndoUtil from './useUndoUtil';
import './VVTable.css';
export default function VVTable(props){
    const [contextValue, updateContextValue] = useReducer(reducer);
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let calendarUtility=new CalendarUtility();
            let roster = new Roster();
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let rosterList = await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);            
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let systemParam=props.systemParam;
            updateContextValue({
                type:'updateRosterMonth',
                value:{
                    activeShiftInfoList,
                    calendarUtility,
                    monthlyCalendar,
                    rosterList,
                    systemParam,
                    updateContextValue
                }    
            });
        };
        getData();
    },[props])
    function reducer(state,action){
        switch (action.type){
            case 'updateRosterMonth':
                return action.value;
            default:
                return state;
        }
    }
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
            {<VVBody/>}
            </RosterWebContext.Provider>
        </table>    
    )
}