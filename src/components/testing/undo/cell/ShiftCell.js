import {useContext,useEffect,useState} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import './ShiftCell.css';
export default function ShiftCell(props){
    let className="shiftCell";

    let myProps=Object.assign({},props);
    delete myProps.activeShiftInfoList;
    delete myProps.itoId;
    delete myProps.onMouseEnter;
    delete myProps.onBlur;    
    delete myProps.setIsHighLightRow;
    delete myProps.rowIndex;
    //console.log(props.contentEditable);
    let {activeShiftInfoList,rosterList,setHightLightCellIndex,undoUtil}=useContext(RosterWebContext);
    if (props.className){
        className+=" "+props.className;
    }
    if(activeShiftInfoList[props.children]){
        className+=' '+activeShiftInfoList[props.children].cssClassName;
    }
    useEffect(()=>{
    
        console.log("Catched Change");
    },[props.children]);
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        props.setIsHighLightRow(false);
   }
    let hightLight = e => {
        if (props.onMouseEnter){
            props.onMouseEnter(e);
        }
        setHightLightCellIndex(e.target.cellIndex);
        props.setIsHighLightRow(true);
    }
    function updateValue(e){
        //setValue(e.target.textContent);
        let temp=JSON.parse(JSON.stringify(rosterList.present));
        temp[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
        undoUtil.set(temp);
    }
    
    return(
        <BorderedAlignCenterCell 
            {...myProps}
            className={className}            
            onBlur={updateValue}
            onMouseLeave={deHightLight}
            onMouseEnter={hightLight}
            setHightLightCellIndex={setHightLightCellIndex}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}