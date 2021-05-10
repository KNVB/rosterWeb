import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import SelectedRegionUtil from './SelectedRegionUtil';
import UndoableData from './UndoableData';
export default function useRosterMonth(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let roster = new Roster();
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let rosterSchedulerList= await roster.getRosterSchedulerList(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let hightLightCellIndex=-1;
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let systemParam=props.systemParam;
            let selectedRegionUtil=new SelectedRegionUtil(rosterSchedulerList.rosterList,monthlyCalendar,0);
            let undoableRosterList=new UndoableData(rosterSchedulerList);
            let yearlyRosterStatistic=await roster.getYearlyRosterStatistic(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        selectedRegionUtil:selectedRegionUtil,
                        systemParam:systemParam,
                        undoableRosterList:undoableRosterList,
                        updateContext:updateContext,
                        yearlyRosterStatistic:yearlyRosterStatistic
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
            case 'updateRoster':
                return {
                    ...state,
                    undoableRosterList:action.value,
                }
            case 'updateRosterMonth':
                return action.value;
            case 'updateSelectedRegion':
                return {
                    ...state,
                    selectedRegionUtil:action.value,
                }
            default:return state;    
        }        
    }    
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return contextValue;
}