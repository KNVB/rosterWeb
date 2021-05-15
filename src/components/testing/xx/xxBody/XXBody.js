import {useCallback,useContext,useEffect} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterRow from './RosterRow';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function XXBody(props){
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let rowList=[],headerRowCount=3;
    //let itoId="ITO1_1999-01-01";
    //let itoId="ITO3_2017-10-18";
    Object.keys(contextValue.rosterData.presentValue).forEach(itoId=>{
        rowList.push(
            <RosterRow 
                itoRoster={contextValue.rosterData.presentValue[itoId].rosterList}
                key={itoId+'_shiftList'}
                itoId={itoId}
                rowIndex={rowList.lenght+headerRowCount}
                previousMonthRoster={contextValue.previousMonthShiftList[itoId]}/>
        )
        rowList.push(
            <PreferredShiftRow
                itoId={itoId}
                key={itoId+'_preferredShiftList'}
                preferredShiftList={contextValue.rosterData.presentValue[itoId].preferredShiftList}
                rowIndex={rowList.lenght+headerRowCount}/>
        )
    });        
    let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            switch (e.which){
                case 89: //Handle Ctrl-Y
                    e.preventDefault();
                    if (contextValue.rosterData.canRedo()){
                        contextValue.rosterData.redo();
                        updateContext({type:'updateRosterData', value:contextValue.rosterData})
                    }
                    break;
                case 90: //Handle Ctrl-Z
                    e.preventDefault();
                    if (contextValue.rosterData.canUndo()){
                        contextValue.rosterData.undo();
                        updateContext({type:'updateRosterData', value:contextValue.rosterData})
                    }
                    break
                default:break;    
            }
        }
    },[updateContext,contextValue.rosterData]); 
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown,contextValue.rosterData]);        
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}