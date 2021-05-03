import {useEffect,useReducer,useState} from "react";
import useUndoUtil from './useUndoUtil';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';

export default function useRosterMonth(props){
    const [state, dispatch] = useReducer(dataReducer,{});
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let calendarUtility=new CalendarUtility();
            let roster = new Roster();
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let rosterList = await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);            
            let systemParam=props.systemParam;
            dispatch(
                {
                    type:"updateRosterMonth",
                    value:{
                        activeShiftInfoList,
                        monthlyCalendar,
                        rosterList,
                        systemParam
                    }
                }
            )
        }
        getData();
    },[props])
    function dataReducer(state, action){
        console.log(state,action);
        return action.value;
    }
        
}