import {useContext} from 'react';
import NameCell from '../../../cells/nameCell/NameCell';
import RosterWebContext from '../../../../../RosterWebContext';
export default function PreferredShiftNameCell(props){
    let preferredShiftNameCellClass;
    let { highLightRowIndex } = useContext(RosterWebContext);
    if (highLightRowIndex){
        if ((highLightRowIndex.rowType==="preferredShiftRow") && (highLightRowIndex.itoId===props.itoId)){
            preferredShiftNameCellClass="highlightCell";
        }
    }
    return (
        <NameCell className={preferredShiftNameCellClass}>
            {props.children}
        </NameCell>    
    )
}