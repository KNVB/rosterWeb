import { useContext,useEffect,useState } from 'react';
import BorderedCell from './cell/BorderedCell';
import EditableShiftCell from './cell/EditableShiftCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import ShiftCell from './cell/ShiftCell';
export default function UndoRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],nameCellCssClass="";
    let {getBorderClass,rosterList}=useContext(RosterWebContext);
    let itoRoster=rosterList.present[props.itoId];
    
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (let i=1;i<32;i++){
        if (itoRoster.shiftList[i]){
            let className=getBorderClass(i,props.rowIndex);           
            cellList.push(
                <EditableShiftCell 
                    className={className}
                    key={props.itoId+"_shift_"+i}
                    itoId={props.itoId}
                    rowIndex={props.rowIndex}
                    setIsHighLightRow={setIsHighLightRow}>
                    {itoRoster.shiftList[i]}
                </EditableShiftCell>
            )           
        } else {
            //console.log("i="+i);
            cellList.push(<BorderedCell key={props.itoId+"_shift_"+i}/>);
        }
    }
    return(
        <tr id={props.itoId}>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>         
            {cellList}
        </tr>
    )
} 