import {useContext,useState} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import Parser from "html-react-parser";
import EditableShiftCell from './EditableShiftCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function RosterRow(props){
    let cellList=[],nameCellCssClass="";
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let {systemParam}=useContext(RosterWebContext);
    let itoNameContact = Parser(props.roster.itoName+ "<br>" + props.roster.itoPostName + " Extn. 2458");
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={props.itoId+"_roster_-"+i}/>
        )
    };
    //console.log(isHighLightRow);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    Object.keys(props.roster.shiftList).forEach(date=>{
        let shift=props.roster.shiftList[date];
        cellList.push(
            <EditableShiftCell
                activeShiftInfoList={props.activeShiftInfoList}
                date={date}
                key={props.itoId+"_shift_"+date}
                setIsHighLightRow={setIsHighLightRow}>
                    {shift}                      
            </EditableShiftCell>
        );
    });
    for (let i=Object.keys(props.roster.shiftList).length;i<31;i++){
        cellList.push(
            <BorderedCell key={props.itoId+"_shift_"+(i+1)}/>
        );  
    }
    return (
        <tr>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
        </tr>
    )
} 