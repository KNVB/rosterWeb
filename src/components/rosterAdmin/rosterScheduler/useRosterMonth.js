import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import SelectedRegionUtil from './utils/SelectedRegionUtil';
import UndoableData from './utils/UndoableData';
export default function useRosterMonth(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let roster = new Roster(props.changeLoggedInFlag);
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let hightLightCellIndex=-1;
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let rosterSchedulerList=await roster.getRosterSchedulerList(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let yearlyRosterStatistic=await roster.getYearlyRosterStatistic(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        changeLoggedInFlag:props.changeLoggedInFlag,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:new SelectedRegionUtil(rosterSchedulerList,monthlyCalendar,props.systemParam.noOfPrevDate),
                        systemParam:props.systemParam,
                        undoableRosterSchedulerList:new UndoableData(rosterSchedulerList),
                        yearlyRosterStatistic:yearlyRosterStatistic
                    }
                });
        }
        getData();
    },[props]);
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
                    undoableRosterSchedulerList:action.value                    
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
    };
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return [contextValue, updateContext];     
}