import {useContext,useState} from 'react';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
import PreferredShiftCell from './PreferredShiftCell';
import NameCell from '../../cell/NameCell';
import RosterWebContext from '../../../utils/RosterWebContext';
import ShiftCell from '../../cell/ShiftCell';
export default function PreferredShiftRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let [contextValue, updateContext] =useContext(RosterWebContext);
    let cellList=[],i,nameCellCssClass="";
    let itoPreferredShiftList=contextValue.undoableRosterSchedulerList.presentValue.preferredShiftList[props.itoId];
    //console.log(itoPreferredShiftList);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_prev-"+i}/>);
    }
    for(i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex);
        if (itoPreferredShiftList && itoPreferredShiftList[i+1]){
            cellList.push(<PreferredShiftCell className={className} itoId={props.itoId} key={props.itoId+"_preferred_shift_"+i}>{itoPreferredShiftList[i+1]}</PreferredShiftCell>);
        }else {
            cellList.push(<PreferredShiftCell className={className} itoId={props.itoId} key={props.itoId+"_preferred_shift_"+i}></PreferredShiftCell>);
        }
    }
    for (let j=i;j<31;j++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_preferred_shift_"+j}/>);
    }
    return(
        <tr id={props.itoId+':preferredShiftList'}>
            <NameCell className={nameCellCssClass}>Preferred Shift</NameCell>
            {cellList}
            <BorderedAlignCenterCell colSpan="5"/>
            <BorderedAlignCenterCell/>
            <BorderedAlignCenterCell/>
            <BorderedAlignCenterCell/>
            <BorderedAlignCenterCell/>
            <BorderedAlignCenterCell className="tailCell"/>
        </tr>
    )
}