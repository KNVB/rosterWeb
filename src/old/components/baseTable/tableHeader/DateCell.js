import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../../utils/RosterWebContext';
export default function DateCell(props){
    let className="p-0";
    let [contextValue] = useContext(RosterWebContext);
    let dateData=props.dateData;
    let dateOfMonth="";
    if (dateData){
        dateOfMonth=dateData.dateOfMonth;
        if (dateData.today)
            className+=" todayCell";
        if ((dateOfMonth+props.noOfPrevDate)===contextValue.hightLightCellIndex)
            className+=" highlightCell";
    }
    return (
        <BorderedAlignCenterCell className={className}>
            {dateOfMonth}
        </BorderedAlignCenterCell>    
    )
}