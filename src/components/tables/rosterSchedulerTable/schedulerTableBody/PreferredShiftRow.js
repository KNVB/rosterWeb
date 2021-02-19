import {useContext,useState} from 'react';
import PreferredShiftCell from '../cells/preferredShiftCell/PreferredShiftCell';
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
        for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
            if (preferredShiftList[i]){
                cellList.push(<PreferredShiftCell itoid={props.itoId} rowtype="preferredShiftRow" key={props.itoId+"_preferred_shift_"+i}>
                    {preferredShiftList[i]}
                </PreferredShiftCell>);
            } else {
                cellList.push(<PreferredShiftCell itoid={props.itoId} rowtype="preferredShiftRow" key={props.itoId+"_preferred_shift_"+i}></PreferredShiftCell>);
            }
        }
        for (let j=i;j<31;j++){
            cellList.push(<BorderedAlignCenterCell key={props.itoId+"_preferred_shift_"+j}/>);
        }
    } else {
        for (i=0;i<31;i++){
            cellList.push(<PreferredShiftCell itoId={props.itoId} rowType="preferredShiftRow" key={props.itoId+"_preferred_shift_"+i}></PreferredShiftCell>);
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