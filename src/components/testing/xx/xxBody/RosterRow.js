import {useContext,useState} from 'react';
import BorderedCell from '../cell/BorderedCell';
import NameCell from '../cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../../utils/RosterWebContext';
import XXCell from '../cell/XXCell';
import ShiftCell from '../cell/ShiftCell';
export default function RosterRow(props){
    let cellList=[],nameCellCssClass="";
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let itoRoster=props.itoRoster;
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    if (props.previousMonthRoster){
        for(let i=contextValue.systemParam.maxConsecutiveWorkingDay-contextValue.systemParam.noOfPrevDate;i<props.previousMonthRoster.length;i++){
            cellList.push(
                <ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}>
                    {props.previousMonthRoster[i]}
                </ShiftCell>
            );
        }
    }else {
        for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
            cellList.push(<BorderedCell key={"prev-"+i}/>);
        }
    }
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex)
        cellList.push(
            <XXCell 
                availableShiftList={itoRoster.availableShiftList}
                className={className}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                rowIndex={props.rowIndex}>
                {itoRoster.shiftList[i+1]}
            </XXCell>
        );
    }
    for (let i=contextValue.monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
            <BorderedCell key={props.itoId+"_shift_"+i}></BorderedCell>
        );
    }
    return(
        <tr id={props.itoId+':shift'}>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
        </tr>
    )
}