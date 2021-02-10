import {useState} from 'react';
import parse from 'html-react-parser';
import EditableShiftCell from '../../cells/editableShiftCell/EditableShiftCell';
import NameCell from '../../cells/nameCell/NameCell';
import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
export default function RosterSchedulerRow(props){
    const [hightLightRowIndex,setHightLightRowIndex]=useState(-1);
    //console.log(props);
    let content=parse(props.itoRoster.itoName+"<br>"+props.itoRoster.itoPostName+" Extn. 2458");
    let j=1,shiftCellList=[];
    for (let i=props.noOfPrevDate;i>0;i--){
        shiftCellList.push(
            <ShiftCell
                key={props.itoId+"_shift-"+i}
                shiftInfoList={props.shiftInfoList}/>    
        )
    }
    function updateCount(){
        console.log("update count");
    }
    shiftCellList.push(
                        <EditableShiftCell 
                            key={props.itoId+"_shift_"+j}                            
                            setHightLightCellIndex={props.setHightLightCellIndex}
                            setHightLightRowIndex={setHightLightRowIndex}
                            shiftType="a"
                            shiftInfoList={props.shiftInfoList}
                            updateCount={updateCount}>
                        </EditableShiftCell>);
    return(
        <tr>
            <NameCell hightLightRowIndex={hightLightRowIndex}>
                {content}
            </NameCell>
            {shiftCellList}
            <RosterTableCell className="text-center">
                {props.itoRoster.totalHour}
            </RosterTableCell>
        </tr>
    );    
}