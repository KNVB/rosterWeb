import {useEffect,useState} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import UndoBody from './UndoBody';
import useUndo from 'use-undo';
import './UndoTable.css';
export default function UndoTable(props){
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    let [
        rosterList,
        undoUtil
    ]=useUndo(props.rosterTableData.rosterList);
    
    
    let activeShiftInfoList=props.rosterTableData.shiftInfoList;
    let calendarUtility=props.rosterTableData.calendarUtility;
    let monthlyCalendar=props.rosterTableData.monthlyCalendar;
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        monthlyCalendar,
        rosterList,
        setHightLightCellIndex,
        undoUtil
    };    
    console.log(Object.keys(props.rosterTableData.rosterList["ITO1_1999-01-01"].shiftList).length);
    console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
    //console.log(contextValue);
    return (
        <table>
            <RosterWebContext.Provider value={contextValue}>
                <UndoBody/>
            </RosterWebContext.Provider>
        </table>
    )
}