import {useEffect,useReducer} from 'react';
import ButtonPanel from './xxFooter/ButtonPanel';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from './utils/SelectedRegionUtil';
import UndoableData from './utils/UndoableData';
import XXBody from './xxBody/XXBody';
import XXFooter from './xxFooter/XXFooter';
import XXHeader from './xxHeader/XXHeader';
import YearlyRosterStatistic from './xxFooter/YearlyRosterStatistic';
import './XXTable.css';
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
            //let bodyRowCount=2;
            let bodyRowCount=Object.keys(rosterSchedulerList.rosterList).length*2;
            let monthLength=monthlyCalendar.calendarDateList.length;

            let rosterData={};
            //let itoId="ITO1_1999-01-01";
            //let itoId="ITO3_2017-10-18";
            Object.keys(rosterSchedulerList.rosterList).forEach(itoId=>{
                let psl;
                if (rosterSchedulerList.preferredShiftList[itoId]){
                    psl=rosterSchedulerList.preferredShiftList[itoId];
                }else{
                    psl={};
                }
                rosterData[itoId]={
                    rosterList:rosterSchedulerList.rosterList[itoId],
                    preferredShiftList:psl
                };
            })
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        changeLoggedInFlag:props.changeLoggedInFlag,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        "rosterData":new UndoableData(rosterData),
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:new SelectedRegionUtil(bodyRowCount,monthLength,props.systemParam.noOfPrevDate),
                        systemParam:props.systemParam,
                        previousMonthShiftList:rosterSchedulerList.previousMonthShiftList,
                        yearlyRosterStatistic:yearlyRosterStatistic
                    }
                });
        }
        getData();
    },[props]);
    let dataReducer=(state,action)=>{
        switch(action.type){
            case 'updateRosterData':
                return{
                    ...state,
                    rosterData:action.value,
                }
            case 'updateRosterMonth':
                return action.value;
            case "updateHighLightCellIndex":
                return{
                    ...state,
                    hightLightCellIndex:action.value,
                }
            case 'updateSelectedRegion':
                return{
                    ...state,
                    selectedRegionUtil:action.value,
                }
            default:return state;
        }
    }
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    let buttonPanel=<ButtonPanel/>
    let yearlyStat=<YearlyRosterStatistic/>
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={[contextValue, updateContext]}>
                {contextValue.monthlyCalendar && <XXHeader/>}
                {contextValue.rosterData && <XXBody/>}
                {contextValue.activeShiftInfoList && 
                    <XXFooter buttonPanel={buttonPanel} noOfPrevDate={props.systemParam.noOfPrevDate} yearlyStat={yearlyStat}/>
                }
            </RosterWebContext.Provider>
        </table>
    )
}