import {useContext,useEffect,useState} from 'react';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';
import './ShiftCell.css';
export default function P8Cell(props){

    const[className,setClassName]=useState();
    const[value,setValue]=useState();
    
    useEffect(()=>{
        //console.log("h0,"+props.children);
        setValue(props.children);
      },[props.children]);
    useEffect(()=>{
        //console.log("h1,"+className);
        let newClassName="shiftCell "+props.className;
        if(props.activeShiftInfoList[value]){
            newClassName+=' '+props.activeShiftInfoList[value].cssClassName;
        }
        setClassName(newClassName);
    },[value,props.className]);
    let deHightLight = e => {
        props.setHightLightCellIndex(-1);
        props.setIsHighLightRow(false);
   }
    let hightLight = e => {
        props.setHightLightCellIndex(e.target.cellIndex);
        props.setIsHighLightRow(true);
    }
    function updateValue(e){
        setValue(e.target.textContent);
    }
    return(
        <BorderedAlignCenterCell 
            className={className}
            contentEditable={true}
            onBlur={updateValue}
            onMouseLeave={deHightLight}
            onMouseEnter={hightLight}
            suppressContentEditableWarning={true}>
            {value}
        </BorderedAlignCenterCell>
    )
}