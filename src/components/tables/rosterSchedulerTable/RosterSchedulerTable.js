import {useCallback,useEffect,useState} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegion from '../../../utils/SelectedRegion'; 
import SelectedRegionUtil from '../../../utils/SelectedRegionUtil';
import TableHeader from '../tableHeader/TableHeader';
export default function RosterSchedulerTable(props){
    
    const [rosterData,setRosterData]=useState(JSON.parse(sessionStorage.getItem("rosterData")));
    const [monthlyCalendar,setMonthlyCalendar]=useState(props.rosterSchedulerData.monthlyCalendar);
    const [selectedRegion,setSelectedRegion]=useState(new SelectedRegion());
    
    //console.log(rosterData.rosterList);
    /*
    let rosterData=JSON.parse(sessionStorage.getItem("rosterData"));
    let monthlyCalendar=props.rosterSchedulerData.monthlyCalendar;
    */
    
    let mouseUp=useCallback(()=>{
        console.log("mouse up");
        //console.log(selectedRegion.inSelectMode);
        SelectedRegionUtil.endSelect(selectedRegion,setSelectedRegion);       
    },[selectedRegion]);
    
    useEffect(()=>{
        setMonthlyCalendar(props.rosterSchedulerData.monthlyCalendar);
        setRosterData(JSON.parse(sessionStorage.getItem("rosterData")));
 
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp,props.rosterSchedulerData.monthlyCalendar]);
    
    let temp={...props.rosterSchedulerData};
    delete temp.monthlyCalendar;
    
    console.log(monthlyCalendar.calendarDateList.length);
    console.log(Object.keys(rosterData.rosterList['ITO1_1999-01-01'].shiftList).length);
    
    /*
    let contextValue={
        ...temp,
        rosterData,
        monthlyCalendar
    }
    console.log(contextValue);
    */
    return (
        <table id="rosterTable">
            
        </table>
       
    )
}