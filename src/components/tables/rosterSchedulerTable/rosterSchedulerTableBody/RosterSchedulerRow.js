import { SytemContext } from '../../../SystemContext';
import {useContext,useState} from 'react';
import parse from 'html-react-parser'
import NameCell from '../../cells/nameCell/NameCell';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
export default function RosterSchedulerRow(props){
    const [hightLightRowIndex,setHightLightRowIndex]=useState(-1);
    console.log(props);
    let content=parse(props.itoRoster.itoName+"<br>"+props.itoRoster.itoPostName+" Extn. 2458");
    let j=0,shiftCellList=[];
    for (let i=props.noOfPrevDate;i>0;i--){
        shiftCellList.push(
            <ShiftCell
                key={props.itoId+"_shift-"+i}
                shiftInfoList={props.shiftInfoList}/>    
        )
    }
    return(
        <tr>
            <NameCell hightLightRowIndex={hightLightRowIndex}>
                {content}
            </NameCell>
            {shiftCellList}
        </tr>
    );    
}