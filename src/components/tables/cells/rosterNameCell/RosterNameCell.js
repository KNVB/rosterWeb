import {useContext} from 'react';
import NameCell from '../nameCell/NameCell';
import RosterWebContext from '../../../../RosterWebContext';
export default function RosterNameCell(props){
    let rosterNameCellClass;
    let { highLightRowIndex } = useContext(RosterWebContext);
    if (highLightRowIndex){
        if ((highLightRowIndex.rowType==="rosterRow") && (highLightRowIndex.itoId===props.itoId)){
            rosterNameCellClass="highlightCell";
        }
    }
    return (
        <NameCell className={rosterNameCellClass}>
            {props.children}
        </NameCell>    
    )
}