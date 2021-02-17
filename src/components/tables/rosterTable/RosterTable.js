import '../tables.css';
import {useState} from 'react';
import RosterWebContext from '../../../RosterWebContext';
import TableBody from './tableBody/TableBody'; 
import TableFooter from './TableFooter'; 
import TableHeader from '../tableHeader/TableHeader'; 
export default function RosterTable(props){
    let rosterList = props.rosterTableData.rosterList
    
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const [highLightRowIndex, setHighLightRowIndex] = useState();
    
    let activeShiftInfoList=props.rosterTableData.shiftInfoList;
    let calendarUtility=props.rosterTableData.calendarUtility;
    let monthlyCalendar=props.rosterTableData.monthlyCalendar;
    
    let systemParam=props.rosterTableData.systemParam;
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        highLightRowIndex,
        monthlyCalendar,
        rosterList,
        setHightLightCellIndex,
        setHighLightRowIndex,
        systemParam
    }
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={0}/>
                <TableBody noOfPrevDate={0}/>
                <TableFooter/>
            </RosterWebContext.Provider>
        </table>
    );
}