import {useCallback,useContext,useEffect} from 'react';
import VacantShiftRow from './VacantShiftRow';
import XXPreferreShiftRow from './XXPreferreShiftRow';
import XXRosterRow from './XXRosterRow';

import RosterWebContext from '../../../../utils/RosterWebContext';
export default function XXBody(props){
    let rowList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        contextValue.selectedRegionUtil.endSelect();
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    },[contextValue.selectedRegionUtil,updateContext]);
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp])
    let keyDown=useCallback((e)=>{
        switch (e.which){
            case 37://handle left arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,-1,0);
                    //setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    //})
                    break;
                case 38://handle up arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,-1);
                    //setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    //})
                    break;
                case 39://handle right arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,1,0);
                    //setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    //})
                    break;
                case 40://handle down arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,1);
                    //setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    //})
                    break;
        }
    })
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown]);
    let headerRowCount=3;    
    Object.keys(contextValue.rosterList).forEach(itoId=>{
        rowList.push(<XXRosterRow itoId={itoId} key={itoId+'_shift'} rowIndex={rowList.length+headerRowCount}/>);
        rowList.push(<XXPreferreShiftRow itoId={itoId} key={itoId+'_preferredShift'} rowIndex={rowList.length+headerRowCount}/>);
    })
    return (
        <tbody>
            {rowList}
            <VacantShiftRow/>
        </tbody>
    )
}