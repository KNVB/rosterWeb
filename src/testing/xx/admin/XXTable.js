import {useEffect,useReducer} from 'react';
import './XXTable.css';

import AdminRoster from './utils/AdminRoster';
import AdminShiftStatUtil from './utils/AdminShiftStatUtil';
import AutoPlanner from './components/AutoPlanner';
import BaseTable from '../baseTable/BaseTable';
import ButtonPanel from './components/ButtonPanel';
import CalendarUtility from '../utils/calendar/CalendarUtility';
import ITOShiftStatUtil from '../utils/ITOShiftStatUtil';
import LoadingImage from './components/icon.gif';
import RosterWebContext from '../utils/RosterWebContext';
import SelectedRegionUtil from './utils/SelectedRegionUtil';
import UndoableData from './utils/UndoableData';
import XXBody from './xxBody/XXBody';
import YearlyRosterStatistic from './components/YearlyRosterStatistic';

export default function XXTable(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let {getAllITOStat}=AdminShiftStatUtil();
            let {getITOStat}=ITOShiftStatUtil();

            let adminRoster = new AdminRoster(props.changeLoggedInFlag);
            let activeShiftInfoList= await adminRoster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let hightLightCellIndex=-1;
            
            let itoRosterList={};
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let monthLength=monthlyCalendar.calendarDateList.length;
            let rosterSchedulerList=await adminRoster.getRosterSchedulerList(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let yearlyRosterStatistic=await adminRoster.getYearlyRosterStatistic(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            
            //let bodyRowCount=2;
            let bodyRowCount=Object.keys(rosterSchedulerList.itoRosterList).length*2;
            Object.keys(rosterSchedulerList.itoRosterList).forEach(itoId=>{
                itoRosterList[itoId]=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,rosterSchedulerList.itoRosterList[itoId]);
            });
            
            //console.log(rosterSchedulerList);

            //console.log(itoRosterList);
            //console.log(allITOStat);
            let allITOStat=getAllITOStat(activeShiftInfoList,monthlyCalendar,itoRosterList);
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        "allITOStat":allITOStat,
                        calendarUtility:calendarUtility,
                        changeLoggedInFlag:props.changeLoggedInFlag,
                        hightLightCellIndex:hightLightCellIndex,
                        isShowLoadingImage:false,
                        itoRosterList:new UndoableData(itoRosterList),                        
                        monthlyCalendar:monthlyCalendar,
                        previousMonthShiftList:rosterSchedulerList.previousMonthShiftList,                        
                        rosterMonth:props.rosterMonth,
                        selectedRegionUtil:new SelectedRegionUtil(bodyRowCount,monthLength,props.systemParam.noOfPrevDate),
                        systemParam:props.systemParam,
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
                let {getAllITOStat}=AdminShiftStatUtil();
                let allITOStat=getAllITOStat(state.activeShiftInfoList,state.monthlyCalendar,action.value.presentValue);
                return{
                    ...state,
                    "allITOStat":allITOStat,
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
    let autoPlanner=<AutoPlanner/>
    let buttonPanel=<ButtonPanel/>
    let yearlyStat=<YearlyRosterStatistic/>
    return(
        <RosterWebContext.Provider value={[contextValue, updateContext]}>
            <BaseTable 
                autoPlanner={autoPlanner}
                buttonPanel={buttonPanel} 
                noOfPrevDate={props.systemParam.noOfPrevDate}
                yearlyStat={yearlyStat}>
                {contextValue.itoRosterList && <XXBody/>}
            </BaseTable>
            {contextValue.isShowLoadingImage && 
                <div  className="modalBackground">
                    <img src={LoadingImage} alt='loadingImage'/>
                </div>
            }
        </RosterWebContext.Provider>
    )
}