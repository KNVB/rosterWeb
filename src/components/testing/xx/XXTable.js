import {useEffect,useReducer} from 'react';
import ITOShiftStatUtil from './utils/ITOShiftStatUtil';
import BaseTable from './baseTable/BaseTable';
import ButtonPanel from './xxFooter/ButtonPanel';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from './utils/SelectedRegionUtil';
import UndoableData from './utils/UndoableData';
import XXBody from './xxBody/XXBody';
import XXFooter from './xxFooter/XXFooter';
import YearlyRosterStatistic from './xxFooter/YearlyRosterStatistic';

export default function XXTable(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let roster = new Roster(props.changeLoggedInFlag);
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let hightLightCellIndex=-1;
            let {getITOStat}=ITOShiftStatUtil();
            let itoRosterList={};
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let monthLength=monthlyCalendar.calendarDateList.length;
            let rosterSchedulerList=await roster.getRosterSchedulerList(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let yearlyRosterStatistic=await roster.getYearlyRosterStatistic(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            
            //let bodyRowCount=2;
            let bodyRowCount=Object.keys(rosterSchedulerList.itoRosterList).length*2;
            Object.keys(rosterSchedulerList.itoRosterList).forEach(itoId=>{
                itoRosterList[itoId]=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,rosterSchedulerList.itoRosterList[itoId]);
            });
            
            //console.log(rosterSchedulerList);

            //console.log(itoRosterList);
            //console.log(allITOStat);
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        changeLoggedInFlag:props.changeLoggedInFlag,
                        hightLightCellIndex:hightLightCellIndex,
                        monthlyCalendar:monthlyCalendar,
                        itoRosterList:new UndoableData(itoRosterList),
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:new SelectedRegionUtil(bodyRowCount,monthLength,props.systemParam.noOfPrevDate),
                        systemParam:props.systemParam,
                        previousMonthShiftList:rosterSchedulerList.previousMonthShiftList,
                        yearlyRosterStatistic:yearlyRosterStatistic
                    }
                }
            );
        }
        getData();
    },[props]);
    let dataReducer=(state,action)=>{
        switch(action.type){
            case 'updateRosterData':
                return{
                    ...state,
                    itoRosterList:action.value,
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
        <RosterWebContext.Provider value={[contextValue, updateContext]}>
            <BaseTable noOfPrevDate={props.systemParam.noOfPrevDate}>
            
                {contextValue.itoRosterList && <XXBody/>}
            {/*                
                {contextValue.activeShiftInfoList && 
                    <XXFooter buttonPanel={buttonPanel} noOfPrevDate={props.systemParam.noOfPrevDate} yearlyStat={yearlyStat}/>
                }
            */}
            </BaseTable>
        </RosterWebContext.Provider>
    )
}