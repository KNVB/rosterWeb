import {useContext,useState} from 'react';
import BorderedCell from '../../../cell/BorderedCell';
import BorderedAlignCenterCell from '../../../cell/BorderedAlignCenterCell';
import EditableShiftCell from '../cell/EditableShiftCell';
import NameCell from '../../../cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from '../../../cell/ShiftCell';
export default function RosterRow(props){
    let cellList=[],nameCellCssClass="";
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let [contextValue]=useContext(RosterWebContext);
    let itoRoster=contextValue.itoRosterList.presentValue[props.itoId];
    let previousMonthShift=contextValue.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    if (previousMonthShift){
        for(let i=contextValue.systemParam.maxConsecutiveWorkingDay-contextValue.systemParam.noOfPrevDate;i<previousMonthShift.length;i++){
            cellList.push(
                <ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}>
                    {previousMonthShift[i]}
                </ShiftCell>
            );
        }
    }else {
        for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
            cellList.push(<BorderedCell key={"prev-"+i}/>);
        }
    }
    //console.log(itoRoster);
    
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex);
        if (props.duplicatShiftList.includes(i+1)){
            className+=' errorRedBlackGround';
        }
        cellList.push(
            <EditableShiftCell
                availableShiftList={itoRoster.availableShiftList}
                className={className}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                rowIndex={props.rowIndex}
                setIsHighLightRow={setIsHighLightRow}>
                {itoRoster.shiftList[i+1]}
            </EditableShiftCell>
        );        
    }
    for (let i=contextValue.monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
            <BorderedCell key={props.itoId+"_shift_"+i}></BorderedCell>
        );
    }
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    return(
        <tr id={props.itoId+':shift'}>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
            <BorderedAlignCenterCell >{itoRoster.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell >{itoRoster.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell className="tailCell">{itoRoster.actualWorkingDayCount}</BorderedAlignCenterCell>         
        </tr>
    )
}