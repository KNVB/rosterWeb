import {useEffect,useState} from 'react';
import './UndoTable.css';
import RosterWebContext from '../../../utils/RosterWebContext';
import TableHeader from '../../tables/tableHeader/TableHeader';
import UndoBody from './UndoBody';
import useUndo from 'use-undo';
import useEvent from './useEvent';
import useSelectedRegion from './useSelectedRegion';
    export default function UndoTable(props){
        let [
            rosterList,
            undoUtil
        ]=useUndo(props.rosterTableData.rosterList);
        
        const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
        const [contextValue,setContextValue]=useState({})
        let selectedRegionUtil=useSelectedRegion();
        useEvent(selectedRegionUtil,undoUtil);
        function showData(){
            console.log(rosterList.present);
        }
        useEffect(()=>{
            undoUtil.reset(props.rosterTableData.rosterList);
        /*
            console.log(Object.keys(props.rosterTableData.rosterList["ITO1_1999-01-01"].shiftList).length);
            console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
        */    
        },[props.rosterTableData])
        
        useEffect(()=>{    
            //console.log(Object.keys(props.rosterTableData.rosterList["ITO1_1999-01-01"].shiftList).length);
            //console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
        
            let activeShiftInfoList=props.rosterTableData.shiftInfoList;
            let calendarUtility=props.rosterTableData.calendarUtility;
            let monthlyCalendar=props.rosterTableData.monthlyCalendar;
            setContextValue({
                activeShiftInfoList,
                calendarUtility,                
                hightLightCellIndex,
                monthlyCalendar,
                rosterList,
                selectedRegionUtil,
                setHightLightCellIndex,
                undoUtil
            });
        },[hightLightCellIndex,selectedRegionUtil.copiedRegion,selectedRegionUtil.selectedRegion,rosterList]);        
        return (
            <table id="rosterTable">
                <RosterWebContext.Provider value={contextValue}>
                    <TableHeader noOfPrevDate={0}/>
                    <UndoBody/>
                    <tfoot>
                        <tr>
                            <td colSpan="32">
                                <button onClick={showData}>Show Data</button>
                            </td>
                        </tr>
                    </tfoot>
                </RosterWebContext.Provider>
            </table>
        )
    }