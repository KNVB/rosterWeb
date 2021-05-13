import {useEffect,useReducer} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from './SelectedRegionUtil';
import UndoableData from './UndoableData';
import XXBody from './xxBody/XXBody';
import XXHeader from './xxHeader/XXHeader';
export default function XXTable(props){
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
            let bodyRowCount=Object.keys(rosterSchedulerList.rosterList).length*2;
            let monthLength=monthlyCalendar.calendarDateList.length;

            let rosterList={};
            let preferredShiftList={};
            Object.keys(rosterSchedulerList.rosterList).forEach(itoId=>{
                let itoRoster=rosterSchedulerList.rosterList[itoId];
                rosterList[itoId]=new UndoableData(itoRoster);
            })
            Object.keys(rosterSchedulerList.preferredShiftList).forEach(itoId=>{
                preferredShiftList[itoId]=new UndoableData(rosterSchedulerList.preferredShiftList[itoId]);
            });
            
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        changeLoggedInFlag:props.changeLoggedInFlag,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        rosterList:rosterList,
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:new SelectedRegionUtil(bodyRowCount,monthLength,props.systemParam.noOfPrevDate),
                        systemParam:props.systemParam,
                        preferredShiftList:preferredShiftList,
                        previousMonthShiftList:rosterSchedulerList.previousMonthShiftList,
                        yearlyRosterStatistic:yearlyRosterStatistic
                    }
                });
        }
        getData();
    },[props]);
    let dataReducer=(state,action)=>{
        switch(action.type){
            case 'updatePreferredShift':
                return{
                    ...state,
                    preferredShiftList:action.value,
                }
            case 'updateRoster':
                return{
                    ...state,
                    rosterList:action.value,
                }
            case 'updateRosterMonth':
                return action.value;
            case 'updateSelectedRegion':
                return{
                    ...state,
                    selectedRegionUtil:action.value,
                }
            default:return state;
        }
    }
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={[contextValue, updateContext]}>
                {contextValue.monthlyCalendar && <XXHeader/>}
                {contextValue.rosterList && <XXBody/>}
            </RosterWebContext.Provider>
        </table>
    )
}