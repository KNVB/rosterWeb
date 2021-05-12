import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import SelectedRegionUtil from './SelectedRegionUtil';
import UndoableData from './UndoableData';
import RosterWebContext from '../../../utils/RosterWebContext';
import XXBody from './XXBody';
import XXFooter from './XXFooter';
import XXHeader from './xxHeader/XXHeader';
import './XXTable.css';
//import useRosterMonth from './useRosterMonth';
export default function XXTable(props){
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
            let undoablePreferredShiftList={};
            Object.keys(rosterSchedulerList.rosterList).forEach(itoId=>{
                let temp=new UndoableData(rosterSchedulerList.rosterList[itoId].shiftList);
                rosterSchedulerList.rosterList[itoId].shiftList=temp;
                if (rosterSchedulerList.preferredShiftList[itoId]){
                    undoablePreferredShiftList[itoId]=new UndoableData(rosterSchedulerList.preferredShiftList[itoId]);
                }else {
                    undoablePreferredShiftList[itoId]=new UndoableData({});
                }
            })
            
            //let undoableRosterList=new UndoableData(rosterSchedulerList.rosterList);
            //let undoablePreferredShiftList=new UndoableData(rosterSchedulerList.preferredShiftList);
            let yearlyRosterStatistic=await roster.getYearlyRosterStatistic(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:selectedRegionUtil,
                        systemParam:systemParam,
                        preferredShiftList:undoablePreferredShiftList,
                        rosterList:rosterSchedulerList.rosterList,
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
                    rosterList:action.value,
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
    console.log('table');
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={[contextValue,updateContext]}>
                {contextValue.monthlyCalendar && <XXHeader/>}
                {contextValue.rosterList && <XXBody/>}
            </RosterWebContext.Provider>
        </table>    
    )
}