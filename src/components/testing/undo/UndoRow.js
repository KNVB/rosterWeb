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
    let {rosterList}=useContext(RosterWebContext);
    let itoRoster=rosterList.present[props.itoId];
    
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (let i=1;i<32;i++){
        if (itoRoster.shiftList[i]){
            cellList.push(
                <EditableShiftCell 
                    key={props.itoId+"_shift_"+i}
                    itoId={props.itoId}
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
        <tr>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>         
            {cellList}
        </tr>
    )
} 