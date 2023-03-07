import {useEffect,useReducer} from 'react';
import BaseTable from '../baseTable/BaseTable';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import ITOShiftStatUtil from '../../utils/ITOShiftStatUtil';
import Roster from '../../utils/Roster';
import RosterViewerBody from './RosterViewerBody';
import RosterWebContext from '../../utils/RosterWebContext';
export default function RosterViewerTable(props){
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get Data from DB");
            let {getITOStat}=ITOShiftStatUtil();
            let itoRosterList={};
            let roster = new Roster(props.changeLoggedInFlag);
            let activeShiftInfoList= await roster.getAllActiveShiftInfo();
            let calendarUtility=new CalendarUtility();
            let hightLightCellIndex=-1;
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let rosterList=await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);

            Object.keys(rosterList).forEach(itoId=>{
                itoRosterList[itoId]=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,rosterList[itoId]);
            });
            updateContext(
                {
                    type:'updateRosterMonth',
                    value:{
                        activeShiftInfoList:activeShiftInfoList,
                        calendarUtility:calendarUtility,
                        hightLightCellIndex:hightLightCellIndex,
                        itoRosterList:itoRosterList,
                        monthlyCalendar:monthlyCalendar,
                    }
                }
            );
        }
        getData();
    },[props]);
    let dataReducer=(state,action)=>{
        switch(action.type){
            case "updateHighLightCellIndex":
                return{
                    ...state,
                    hightLightCellIndex:action.value,
                }
            case 'updateRosterMonth':
                return action.value;
            default:return state;    
        }
    };
    const [contextValue, updateContext] = useReducer(dataReducer,{});
    return (
        <RosterWebContext.Provider value={[contextValue, updateContext]}>
            <BaseTable noOfPrevDate={0}>
                {contextValue.itoRosterList && <RosterViewerBody/>}
            </BaseTable>
        </RosterWebContext.Provider>
    )    
}