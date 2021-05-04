import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import RosterWebContext from '../../../utils/RosterWebContext';
import Roster from '../../../utils/Roster';
import SelectedRegionUtil from './SelectedRegionUtil';
import VVBody from './VVBody';
import UndoableData from './UndoableData';

import './VVTable.css';
export default function VVTable(props){
    let dataReducer=(state,action)=>{
        switch (action.type){
            case "updateHighLightCellIndex":
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:action.value,
                    monthlyCalendar:state.monthlyCalendar,
                    selectedRegionUtil:state.selectedRegionUtil,
                    systemParam:state.systemParam,
                    undoableRosterList:state.undoableRosterList,
                    updateContext:state.updateContext
                }
            case 'updateRoster':
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:state.hightLightCellIndex,
                    monthlyCalendar:state.monthlyCalendar,
                    selectedRegionUtil:state.selectedRegionUtil,
                    systemParam:state.systemParam,
                    undoableRosterList:action.value,
                    updateContext:state.updateContext
                }
            case 'updateRosterMonth':
                return action.value;
            case 'updateSelectedRegion':
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:state.hightLightCellIndex,
                    monthlyCalendar:state.monthlyCalendar,
                    selectedRegionUtil:action.value,
                    systemParam:state.systemParam,
                    undoableRosterList:state.undoableRosterList,
                    updateContext:state.updateContext
                }
            default:return state;    
        }
        
    }
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
            let selectedRegionUtil=new SelectedRegionUtil(rosterList,monthlyCalendar);
            let undoableRosterList=new UndoableData(rosterList);
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
                        updateContext:updateContext
                    }
                }
            );
        }
        getData();
    },[props])
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
            {<VVBody/>}
            </RosterWebContext.Provider>
        </table>    
    )
}