import {useCallback,useEffect,useState} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import UndoBody from './UndoBody';
import useUndo from 'use-undo';
import useSelectedRegion from './useSelectedRegion';
import './UndoTable.css';
    export default function UndoTable(props){
        const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
        const [contextValue,setContextValue]=useState({})
        let [startSelect,endSelect,updateSelect,copySelectedRegion,getBorderClass,pasteCopiedRegion]=useSelectedRegion();
        let [
            rosterList,
            undoUtil
        ]=useUndo(props.rosterTableData.rosterList);
        
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
                copySelectedRegion,
                endSelect,
                getBorderClass,
                hightLightCellIndex,
                monthlyCalendar,
                pasteCopiedRegion,
                rosterList,
                startSelect,
                setHightLightCellIndex,
                undoUtil,
                updateSelect
            });
        },[rosterList,props.rosterTableData]);                        
        let keyDown=useCallback((e)=>{
            console.log("keyDown");
            if (e.ctrlkey){
                switch (e.which){
                  case 89:
                          if (undoUtil.canRedo){
                            e.preventDefault();
                            undoUtil.redo();
                          }
                          break;
                  case 90:
                          if (undoUtil.canUndo){
                            e.preventDefault();
                            undoUtil.undo();
                          }        
                }
            }
        });
        useEffect(()=>{
            document.addEventListener('keydown',keyDown);
            return () => {
                document.removeEventListener('keydown', keyDown)
            }
        },[keyDown]);
        //console.log(contextValue);   
        function showData(){
            console.log(rosterList.present);
        }
        return (
            <table>
                <RosterWebContext.Provider value={contextValue}>
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