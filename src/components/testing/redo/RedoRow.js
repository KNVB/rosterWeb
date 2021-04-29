import { useContext,useState } from 'react';
import BorderedCell from './cell/BorderedCell';
import BorderedAlignCenterCell from './cell/BorderedAlignCenterCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import useShift from './useShift';
export default function RedoRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let {activeShiftInfoList,monthlyCalendar,rosterList,selectedRegionUtil}=useContext(RosterWebContext);
    let {getITOStat}=useShift();
    let cellList=[],nameCellCssClass="";
    let itoRoster=rosterList.present[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    let itoStat=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
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