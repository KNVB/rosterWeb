import {useState} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import UnreTableBody from './UnreTableBody'; 
export default function UnreTable(props){
    let rosterList =props.rosterTableData.rosterList;
    
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    
    let activeShiftInfoList=props.rosterTableData.shiftInfoList;
    let calendarUtility=props.rosterTableData.calendarUtility;
    let monthlyCalendar=props.rosterTableData.monthlyCalendar;
    let systemParam=props.rosterTableData.systemParam;

    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        monthlyCalendar,
        rosterList,
        setHightLightCellIndex,
        systemParam    
    }
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>               
                <UnreTableBody/>
            </RosterWebContext.Provider>
        </table>
    );
}