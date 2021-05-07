import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import SelectedRegionUtil from '../../../utils/SelectedRegionUtil';
import UndoableData from '../../../utils/UndoableData';
export default function useRosterMonth(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let roster = new Roster();
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let hightLightCellIndex=-1;
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let rosterSchedulerList=await roster.getRosterSchedulerList(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let systemParam=props.systemParam;
            let selectedRegionUtil=new SelectedRegionUtil(rosterSchedulerList,monthlyCalendar,systemParam.noOfPrevDate);
            let undoableRosterSchedulerList=new UndoableData(rosterSchedulerList);
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
                        undoableRosterSchedulerList:undoableRosterSchedulerList,
                        updateContext:updateContext
                    }
                });
        }
        getData();
    },[props]);
    let dataReducer=(state,action)=>{
        switch (action.type){
            case 'updateRosterMonth':
                return action.value;
            default:return state;
        }
    };
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return contextValue;     
}