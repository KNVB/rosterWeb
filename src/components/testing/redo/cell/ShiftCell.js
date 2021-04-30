import {useContext,useEffect,useState} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import './ShiftCell.css';
export default function ShiftCell(props){
    let [className,setClassName]=useState(["shiftCell"]);

    let myProps=Object.assign({},props);
    let {activeShiftInfoList,rosterList,undoUtil}=useContext(RosterWebContext);
    delete myProps.activeShiftInfoList;
    delete myProps.itoId;
    delete myProps.onMouseEnter;
    delete myProps.onBlur;    
    delete myProps.setIsHighLightRow;
    delete myProps.rowIndex;
    delete myProps.updateContextValue;
    //console.log(props.contentEditable);
    
    useEffect(()=>{
        let temp=["shiftCell"];
        //console.log(activeShiftInfoList,props.children);
        if(activeShiftInfoList[props.children]){
            temp.push(activeShiftInfoList[props.children].cssClassName);
        }
        if (props.className){
            temp.push(props.className);   
        }
        setClassName(temp);
    },[activeShiftInfoList,props.children,props.className])    

    let deHightLight = e => {
        props.setIsHighLightRow(false);
        props.updateContextValue({type:"setHightLightCellIndex",value:-1})
    }
    let hightLight = e => {
        if (props.onMouseEnter){
            props.onMouseEnter(e);
        }
        props.setIsHighLightRow(true);        
        props.updateContextValue({type:"setHightLightCellIndex",value:e.target.cellIndex})
    }
    function updateValue(e){
        //setValue(e.target.textContent);
        let row=e.target.parentElement;
        //console.log(row.rowIndex+","+e.target.cellIndex);
        //console.log("On blur");
        let temp=JSON.parse(JSON.stringify(rosterList.presentValue));
        temp[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
        //console.log("Before:"+JSON.stringify(rosterList.present));
        rosterList.set(temp);
        //console.log("After:"+JSON.stringify(rosterList.present));
        props.updateContextValue({type:"updateShiftValue",value:rosterList});
    }
    return(
        <BorderedAlignCenterCell 
            {...myProps}
            className={className.join(' ')}            
            onBlur={updateValue}
            onMouseLeave={deHightLight}
            onMouseEnter={hightLight}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}