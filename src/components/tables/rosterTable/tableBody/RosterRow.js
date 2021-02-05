import { useState} from 'react';
import parse from 'html-react-parser';
import CursorCell from '../../cells/cursorCell/CursorCell';
import NameCell from '../../cells/nameCell/NameCell';
export default function RosterRow(props){
    //console.log(props);
    const [hightLightRowIndex,setHightLightRowIndex]=useState(-1);
    let cursorCellList=[];
    let content=parse(props.itoRoster.itoName+"<br>"+props.itoRoster.itoPostName+" Extn. 2458");
    let itoShift="";
    for (let j=0;j<31;j++){
        itoShift=props.itoRoster.shiftList[j];
        cursorCellList.push(
            <CursorCell
                setHightLightCellIndex={props.setHightLightCellIndex}
                setHightLightRowIndex={setHightLightRowIndex}
                key={props.itoId+"_shift_"+j}>
                {itoShift}
            </CursorCell>
        );
    }
    return(
        <tr>
            <NameCell hightLightRowIndex={hightLightRowIndex}>{content}</NameCell>
            {cursorCellList}
        </tr>
    )
}