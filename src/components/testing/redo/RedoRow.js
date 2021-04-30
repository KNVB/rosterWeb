import { useContext,useState } from 'react';
import BorderedCell from './cell/BorderedCell';
import BorderedAlignCenterCell from './cell/BorderedAlignCenterCell';
import EditableShiftCell from './cell/EditableShiftCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegion from './SelectedRegion';
import useShift from './useShift';
import SelectedRegionUtil from './SelectedRegionUtil';
export default function RedoRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let {activeShiftInfoList,monthlyCalendar,rosterList,selectedRegionUtil}=useContext(RosterWebContext);
    let {getITOStat}=useShift();
    let cellList=[],nameCellCssClass="";
    let itoRoster=rosterList.presentValue[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    let itoStat=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);

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
                    updateContextValue={props.updateContextValue}
                    setIsHighLightRow={setIsHighLightRow}>
                    {itoRoster.shiftList[i]}
                </EditableShiftCell>
            )           
        } else {
            cellList.push(<BorderedCell key={props.itoId+"_shift_"+i}/>);
        }  
    }
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
    );    
}