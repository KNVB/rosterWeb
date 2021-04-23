import {useContext,useEffect,useState} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import './ShiftCell.css';
export default function ShiftCell(props){
    let [className,setClassName]=useState(["shiftCell"]);

    let myProps=Object.assign({},props);
    let {activeShiftInfoList,rosterList,setHightLightCellIndex,undoUtil}=useContext(RosterWebContext);
    delete myProps.activeShiftInfoList;
    delete myProps.itoId;
    delete myProps.onMouseEnter;
    delete myProps.onBlur;    
    delete myProps.setIsHighLightRow;
    delete myProps.rowIndex;
    //console.log(props.contentEditable);
    
    useEffect(()=>{
        let temp=["shiftCell"];
        if(activeShiftInfoList[props.children]){
            temp.push(activeShiftInfoList[props.children].cssClassName);
        }
        if (props.className){
            temp.push(props.className);   
        }
        setClassName(temp);
    },[props.children,props.className])    

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
        let row=e.target.parentElement;
        console.log(row.rowIndex+","+e.target.cellIndex);
        console.log("On blur");
        let temp=JSON.parse(JSON.stringify(rosterList.present));
        temp[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
        undoUtil.set(temp);
    }
    return(
        <BorderedAlignCenterCell 
            {...myProps}
            className={className.join(' ')}            
            onBlur={updateValue}
            onMouseLeave={deHightLight}
            onMouseEnter={hightLight}
            setHightLightCellIndex={setHightLightCellIndex}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}