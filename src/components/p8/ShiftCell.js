import {useContext,useEffect,useState} from 'react';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';
import './ShiftCell.css';
export default function ShiftCell(props){
    const[className,setClassName]=useState();
    const[value,setValue]=useState();
    let myProps=Object.assign({},props);
    delete myProps.activeShiftInfoList;
    delete myProps.setIsHighLightRow;
    //console.log(props.contentEditable);
    let {setHightLightCellIndex}=useContext(RosterWebContext);
    useEffect(()=>{
        //console.log("h0,"+props.children);
        setValue(props.children);
      },[props.children]);
    useEffect(()=>{
        //console.log("h1,"+className);
        let newClassName="shiftCell";
        if (props.className){
            newClassName+=" "+props.className;
        }        
        if(props.activeShiftInfoList[value]){
            newClassName+=' '+props.activeShiftInfoList[value].cssClassName;
        }
        setClassName(newClassName);
    },[value,props.className]);
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        props.setIsHighLightRow(false);
   }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        props.setIsHighLightRow(true);
    }
    function updateValue(e){
        setValue(e.target.textContent);
    }
    return(
        <BorderedAlignCenterCell 
            {...myProps}
            className={className}            
            onBlur={updateValue}
            onMouseLeave={deHightLight}
            onMouseEnter={hightLight}
            setHightLightCellIndex={setHightLightCellIndex}>
            {value}
        </BorderedAlignCenterCell>
    )
}