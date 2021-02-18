import {useContext,useState} from 'react';
import CursorCell from '../cells/cursorCell/CursorCell';
import PreferredShiftNameCell from '../cells/preferredShiftNameCell/PreferredShiftNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function PreferredShiftRow(props){
    let cellList=[],i;
    let {activeShiftInfoList,monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
    let preferredShiftList=rosterData.preferredShiftList[props.itoId];
    //console.log(rosterData);
    
    for (i=0;i<systemParam.noOfPrevDate;i++){
        cellList.push(<ShiftCell key={props.itoId+"_prev-"+i}/>);
    }
    if (preferredShiftList){
        for (i=1;i<32;i++){
            if (preferredShiftList[i]){
                cellList.push(<CursorCell itoId={props.itoId} rowType="preferredShiftRow" key={props.itoId+"_shift_"+i}>{preferredShiftList[i]}</CursorCell>);
            } else {
                cellList.push(<CursorCell itoId={props.itoId} rowType="preferredShiftRow" key={props.itoId+"_shift_"+i}></CursorCell>);
            }
        }
    } else {
        for (i=0;i<31;i++){
            cellList.push(<CursorCell itoId={props.itoId} rowType="preferredShiftRow" key={props.itoId+"_shift_"+i}></CursorCell>);
        }
    }
    return(
        <tr>
            <PreferredShiftNameCell itoId={props.itoId}>Preferred Shift</PreferredShiftNameCell>
            {cellList}
            <BorderedAlignCenterCell colSpan="5"/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell className="tailCell"/>            
        </tr>
    )
}