import {useContext,useState} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import Parser from "html-react-parser";
import EditableShiftCell from './EditableShiftCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function RosterRow(props){
    let cellList=[],nameCellCssClass="";
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let {getBorderClass,getITOStat,systemParam}=useContext(RosterWebContext);
    let itoStat=getITOStat(props.activeShiftInfoList, props.monthlyCalendar.noOfWorkingDay, props.roster);
    let itoNameContact = Parser(props.roster.itoName+ "<br>" + props.roster.itoPostName + " Extn. 2458");
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={props.itoId+"_roster_-"+i}/>
        )
    };
    //console.log(isHighLightRow);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (let i=1;i<32;i++){
        if (props.roster.shiftList[i]){
            let shift=props.roster.shiftList[i];
            let x=Number(i)+systemParam.noOfPrevDate;
            let className=getBorderClass(x,props.rowIndex);
            cellList.push(
                <EditableShiftCell
                    className={className}
                    activeShiftInfoList={props.activeShiftInfoList}
                    key={props.itoId+"_shift_"+i}
                    setIsHighLightRow={setIsHighLightRow}>
                        {shift}                      
                </EditableShiftCell>
            );

        } else {
            cellList.push(
                <BorderedCell key={props.itoId+"_shift_"+(i+1)}/>
            );
        }
    }
    
    return (
        <tr>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
            <td id={props.itoId+"_expectedWorkingHour"}>{itoStat.expectedWorkingHour.toFixed(2)}</td>
            <td id={props.itoId+"_actualWorkingHour"}>{itoStat.actualWorkingHour.toFixed(2)}</td>
            <td id={props.itoId+"_lastMonthBalance"}>{itoStat.lastMonthBalance.toFixed(2)}</td>
            <td id={props.itoId+"_thisMonthBalance"}>{itoStat.thisMonthBalance.toFixed(2)}</td>
            <td id={props.itoId+"_totalBalance"}>{itoStat.totalBalance.toFixed(2)}</td>
            <td id={props.itoId+"_aShiftCount"}>{itoStat.shiftCountList.aShiftCount}</td>
            <td id={props.itoId+"_bxShiftCount"}>{itoStat.shiftCountList.bxShiftCount}</td>
            <td id={props.itoId+"_cShiftCount"}>{itoStat.shiftCountList.cShiftCount}</td>
            <td id={props.itoId+"_dsShiftCount"}>{itoStat.shiftCountList.dxShiftCount}</td>
            <td id={props.itoId+"_actualWorkingDayCount"}>{itoStat.actualWorkingDayCount}</td>
        </tr>
    )
} 