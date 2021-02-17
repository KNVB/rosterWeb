import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
export default function DateCell(props){
    let className="p-0";
    let {hightLightCellIndex} = useContext(RosterWebContext);
    let dateData=props.dateData;
    let dateOfMonth="";
    if (dateData){
        dateOfMonth=dateData.dateOfMonth;
        if (dateData.today)
            className+=" todayCell";
        if ((dateOfMonth+props.noOfPrevDate)===hightLightCellIndex)
            className+=" highlightCell";
    }
    return (
        <BorderedAlignCenterCell className={className}>
            {dateOfMonth}
        </BorderedAlignCenterCell>    
    )
}