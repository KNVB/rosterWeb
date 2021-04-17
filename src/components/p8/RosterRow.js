import {useContext} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import Parser from "html-react-parser";
import P8Cell from './P8Cell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function RosterRow(props){
    let cellList=[];
    let {setHightLightCellIndex,systemParam}=useContext(RosterWebContext);
    let itoNameContact = Parser(props.roster.itoName+ "<br>" + props.roster.itoPostName + " Extn. 2458");
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={props.itoId+"_roster_-"+i}/>
        )
    };
    Object.keys(props.roster.shiftList).forEach(date=>{
        let shift=props.roster.shiftList[date];
        cellList.push(
            <P8Cell
                activeShiftInfoList={props.activeShiftInfoList}
                date={date}
                key={props.itoId+"_shift_"+date}
                setHightLightCellIndex={setHightLightCellIndex}>
                {shift}
            </P8Cell>    
        )
    });
    for (let i=Object.keys(props.roster.shiftList).length;i<31;i++){
        cellList.push(
            <BorderedCell key={props.itoId+"_shift_"+(i+1)}/>
        );  
    }
    return (
        <tr>
            <NameCell>{itoNameContact}</NameCell>
            {cellList}
        </tr>
    )
} 