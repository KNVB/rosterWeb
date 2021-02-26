import {useContext,useState} from 'react';
import PreferredShiftCell from '../cells/preferredShiftCell/PreferredShiftCell';
import PreferredShiftNameCell from '../cells/preferredShiftNameCell/PreferredShiftNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function PreferredShiftRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],i;
    let {activeShiftInfoList,monthlyCalendar,rosterData,setHightLightCellIndex,systemParam} = useContext(RosterWebContext);
    let preferredShiftList=rosterData.preferredShiftList[props.itoId];
    //console.log(rosterData);
    
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }
    if (isHighLightRow){
        cellList.push(<PreferredShiftNameCell className="highlightCell"/>);
    } else {
        cellList.push(<PreferredShiftNameCell/>);
    }
    for (i=0;i<systemParam.noOfPrevDate;i++){
        cellList.push(<ShiftCell key={props.itoId+"_prev-"+i}/>);
    }
    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        if (preferredShiftList && preferredShiftList[i+1]){
            cellList.push(<PreferredShiftCell key={props.itoId+"_preferred_shift_"+i} onMouseLeave={deHightLight}
            onMouseEnter={hightLight}>
                {preferredShiftList[i+1]}
            </PreferredShiftCell>);
        } else {
            cellList.push(<PreferredShiftCell key={props.itoId+"_preferred_shift_"+i} onMouseLeave={deHightLight}
            onMouseEnter={hightLight}></PreferredShiftCell>);
        }
    }
    for (let j=i;j<31;j++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_preferred_shift_"+j}/>);
    }
    return(
        <tr>
            
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