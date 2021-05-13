import {useContext} from 'react';
import './VacantShiftRow.css';
import BorderedCell from '../cell/BorderedCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function VacantShiftRow(props){
    let cellList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedCell className="bottomCell" key={'preVacant_'+i}/>);
    }
    return(
        <tr>
            <NameCell className="bottomCell vacantShiftName pr-1">Vacant Shifts</NameCell>
            {cellList}
        </tr>
    )
}