import {useContext,useState} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import Parser from "html-react-parser";
import EditableShiftCell from './EditableShiftCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function RosterRow(props){
    let cellList=[],i,nameCellCssClass="";
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let {activeShiftInfoList,getBorderClass,getITOStat,monthlyCalendar,rosterData,systemParam,updateTableData}=useContext(RosterWebContext);
    let roster=rosterData[props.itoId];
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
    for (i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={props.itoId+"_roster_-"+i}/>
        )
    };
    //console.log(isHighLightRow);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    let shiftList=roster.shiftList;
    for(i=1;i<32;i++){
        let id=props.itoId+"_shift_"+i;
        if (shiftList[i]){
            let shift=shiftList[i];
            let x=Number(i)+systemParam.noOfPrevDate;
            let className=getBorderClass(x,props.rowIndex);
            cellList.push(
                <EditableShiftCell
                    className={className}
                    key={props.itoId+"_shift_"+i}
                    id={props.itoId+"_shift_"+i}
                    setIsHighLightRow={setIsHighLightRow}>
                        {shift}                      
                </EditableShiftCell>
            );
        } else {
            cellList.push(
                <BorderedCell key={id} id={id}/>
            );    
        }
    }
    let itoStat=getITOStat(activeShiftInfoList, monthlyCalendar.noOfWorkingDay, roster); 
    function updateValue(e){
        updateTableData(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,rosterData);
    }
    return (
        <tr>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
            <BorderedAlignCenterCell id={props.itoId+"_expectedWorkingHour"}>{itoStat.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_actualWorkingHour"}>{itoStat.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell contentEditable={true} suppressContentEditableWarning={true} id={props.itoId+"_lastMonthBalance"} onBlur={updateValue}>{itoStat.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_thisMonthBalance"} onBlur={updateValue}>{itoStat.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_totalBalance"}>{itoStat.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_aShiftCount"}>{itoStat.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_bxShiftCount"}>{itoStat.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_cShiftCount"}>{itoStat.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_dsShiftCount"}>{itoStat.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell id={props.itoId+"_actualWorkingDayCount"} className="tailCell">{itoStat.actualWorkingDayCount}</BorderedAlignCenterCell>
        </tr>
    )
} 