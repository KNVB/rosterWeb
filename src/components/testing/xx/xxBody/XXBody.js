import {useContext} from 'react';
import RosterRow from './RosterRow';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function XXBody(props){
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let rowList=[];
    let itoId="ITO1_1999-01-01";
        rowList.push(
            <RosterRow 
                itoRoster={contextValue.rosterData.presentValue[itoId].rosterList}
                key={itoId+'_shiftList'}
                itoId={itoId}
                rowIndex={0}
                previousMonthRoster={contextValue.previousMonthShiftList[itoId]}/>
        )
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}