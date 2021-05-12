import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import Roster from '../../utils/Roster';
export default function useRosterMonth(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let roster = new Roster();
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let rosterList= await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let hightLightCellIndex=-1;
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let systemParam=props.systemParam;
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        systemParam:systemParam,
                        rosterList:rosterList
                    }
                }
            );
        }
        getData();
    },[props])
    let dataReducer=(state,action)=>{
        switch (action.type){
            case "updateHighLightCellIndex":
                return {
                    ...state,
                    hightLightCellIndex:action.value,
                }
            case 'updateRosterMonth':
                return action.value;
            default:return state;    
        }        
    }    
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return [contextValue, updateContext];
}