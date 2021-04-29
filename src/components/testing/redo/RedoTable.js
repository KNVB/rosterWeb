import './RedoTable.css';
import {useEffect,useReducer,useState} from 'react';
import RedoBody from './RedoBody';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from './SelectedRegionUtil';
import TableHeader from '../../tables/tableHeader/TableHeader';
import useUndo from 'use-undo';
import CopiedRegion from './CopiedRegion';
export default function RedoTable(props){
    let [
        rosterList,
        undoUtil
    ]=useUndo(props.rosterTableData.rosterList);
    let hightLightCellIndex=-1;
    let selectedRegionUtil=new SelectedRegionUtil();
    let genParam=()=>{
        return {
            activeShiftInfoList:props.rosterTableData.shiftInfoList,
            calendarUtility:props.rosterTableData.calendarUtility,
            hightLightCellIndex:hightLightCellIndex,
            monthlyCalendar:props.rosterTableData.monthlyCalendar,
            rosterList:rosterList,
            selectedRegionUtil:selectedRegionUtil,
            systemParam:props.rosterTableData.systemParam,
            undoUtil:undoUtil
        }
    }
    function contextValueReducer(state,action){

    }
    const [contextValue, updateContextValue] = useReducer(contextValueReducer, genParam());   
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                {contextValue.monthlyCalendar && <TableHeader noOfPrevDate={0}/>} 
                <RedoBody updateContextValue={updateContextValue}/>
            </RosterWebContext.Provider>
        </table>
    )        
}