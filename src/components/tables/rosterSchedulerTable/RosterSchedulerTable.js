import {useCallback,useState,useEffect} from 'react';
import './RosterSchedulerTable.css';
import Roster from '../../../utils/Roster';
import RosterWebContext from '../../../RosterWebContext';
import RosterSchedulerTableBody from './rosterSchedulerTableBody/RosterSchedulerTableBody';
import RosterSchedulerTableFooter from './rosterSchedulerTableFooter/RosterSchedulerTableFooter';
import SelectedRegion from '../../../utils/SelectedRegion'; 
import TableHeader from '../tableHeader/TableHeader';
import SelectedRegionUtil from '../../../utils/SelectedRegionUtil';
export default function RosterSchedulerTable(props){
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);

    /**
     * Both monthlyCalendar and rosterData must be a state variable,
     * otherwise their data are not in sync.
     */
    const [monthlyCalendar,setMonthlyCalendar]=useState(props.rosterSchedulerData.monthlyCalendar);
    const [rosterData,setRosterData]=useState(props.rosterSchedulerData.rosterData);
    const [selectedRegion,setSelectedRegion]=useState(new SelectedRegion());

    let activeShiftInfoList=props.rosterSchedulerData.activeShiftInfoList;
    let calendarUtility=props.rosterSchedulerData.calendarUtility;
    let changeLoggedInFlag=props.rosterSchedulerData.changeLoggedInFlag;
    let orgRosterData=props.rosterSchedulerData.orgRosterData;
    let rosterMonth=props.rosterSchedulerData.rosterMonth;
    let systemParam=props.rosterSchedulerData.systemParam;
    rosterData.vacantShiftList=Roster.getVacantShiftList(activeShiftInfoList.essentialShift,monthlyCalendar,rosterData.rosterList);
    let yearlyRosterStatistic=props.rosterSchedulerData.yearlyRosterStatistic;
    let mouseUp=useCallback(()=>{
        console.log("mouse up");
        //console.log(selectedRegion.inSelectMode);
        SelectedRegionUtil.endSelect(selectedRegion,setSelectedRegion);       
    },[selectedRegion]);
    useEffect(()=>{
        console.log("Table");
        setMonthlyCalendar(props.rosterSchedulerData.monthlyCalendar);
        setRosterData(props.rosterSchedulerData.rosterData);
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp,props.rosterSchedulerData.monthlyCalendar,props.rosterSchedulerData.rosterData,selectedRegion]);

    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        changeLoggedInFlag,
        hightLightCellIndex,
        monthlyCalendar,
        orgRosterData,
        rosterData,
        rosterMonth,
        selectedRegion,
        setHightLightCellIndex,
        setRosterData,
        setSelectedRegion,
        systemParam,
        yearlyRosterStatistic
    };
    //console.log("RosterSchedulerTable");
    //console.log("Preferred Shift List="+JSON.stringify(rosterData.preferredShiftList));
    //console.log("Roster List="+JSON.stringify(rosterData.rosterList));
    
    //console.log("Table org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
    //console.log("Table current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
    
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={systemParam.noOfPrevDate}/>
                <RosterSchedulerTableBody/>
                <RosterSchedulerTableFooter/>
            </RosterWebContext.Provider>            
        </table>
    );
}