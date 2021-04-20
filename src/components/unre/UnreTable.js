import {useEffect,useReducer,useState} from 'react';
import useUndo from 'use-undo';
import RosterWebContext from '../../utils/RosterWebContext';
import UnreTableBody from './UnreTableBody'; 
export default function UnreTable(props){
    let reducer = (state, action) => {
        console.log(action);
        return(action);
    }
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const [contextValue,setContextValue]=useState();
    let undoObjs=useUndo(props.rosterTableData.rosterList);
    let gg={
        undoObjs,
        hightLightCellIndex:hightLightCellIndex,
        setHightLightCellIndex:setHightLightCellIndex,
        rosterTableData: props.rosterTableData
    }
    const [data, setData] = useReducer(reducer,gg);
    
    useEffect(()=>{
        let activeShiftInfoList=data.rosterTableData.shiftInfoList;
        let calendarUtility=data.rosterTableData.calendarUtility;
        let hightLightCellIndex=data.hightLightCellIndex;
        let monthlyCalendar=data.rosterTableData.monthlyCalendar;
        let setHightLightCellIndex=data.setHightLightCellIndex;
        let systemParam=data.rosterTableData.systemParam;
        let rosterList=data.undoObjs[0];
        let undoUtility=data.undoObjs[2];
        setContextValue(
            {
                activeShiftInfoList,
                calendarUtility,
                hightLightCellIndex,
                monthlyCalendar,
                rosterList,       
                setHightLightCellIndex,
                systemParam,
                undoUtility
            }
        )
    },[data])
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <UnreTableBody/>
            </RosterWebContext.Provider>  
        </table>
    );
}