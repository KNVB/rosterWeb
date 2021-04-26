import { useContext,useState } from 'react';
import BorderedCell from './cell/BorderedCell';
import BorderedAlignCenterCell from './cell/BorderedAlignCenterCell';
import EditableShiftCell from './cell/EditableShiftCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import useShift from './useShift';
export default function UndoRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],nameCellCssClass="";
    let {activeShiftInfoList,monthlyCalendar,rosterList,selectedRegionUtil}=useContext(RosterWebContext);
    let itoRoster=rosterList.present[props.itoId];
    let {getITOStat}=useShift();
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (let i=1;i<32;i++){
        if (itoRoster.shiftList[i]){
            let className=selectedRegionUtil.getBorderClass(i,props.rowIndex);           
            cellList.push(
                <EditableShiftCell 
                    className={className}
                    key={props.itoId+"_shift_"+i}
                    itoId={props.itoId}
                    rowIndex={props.rowIndex}
                    setIsHighLightRow={setIsHighLightRow}>
                    {itoRoster.shiftList[i]}
                </EditableShiftCell>
            )           
        } else {
            //console.log("i="+i);
            cellList.push(<BorderedCell key={props.itoId+"_shift_"+i}/>);
        }
    }
    let itoStat=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
    return(
        <tr id={props.itoId} className="rosterRow">
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>         
            {cellList}
            <BorderedAlignCenterCell>{itoStat.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell className="tailCell">{itoStat.actualWorkingDayCount}</BorderedAlignCenterCell>
        </tr>
    )
} 