import {useContext,useState} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import EditableBalanceCell from './cells/editableBalanceCell/EditableBalanceCell';
import EditableShiftCell from './cells/editableShiftCell/EditableShiftCell';
import Parser from "html-react-parser";
import RosterNameCell from '../../cells/rosterNameCell/RosterNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import Utility from '../../../../utils/Utility';
export default function RosterSchedulerRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],i;
    let {
        activeShiftInfoList,
        monthlyCalendar,
        rosterData,
        setHightLightCellIndex,
        setRosterData,
        systemParam
    } = useContext(RosterWebContext);
    //console.log(rosterData);
    let roster=rosterData.rosterList[props.itoId];    
    let previousMonthShift=rosterData.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
    let rosterRowData=Utility.calculateITOMonthlyStat(monthlyCalendar.noOfWorkingDay,roster,activeShiftInfoList);

    //console.log(roster)
    //console.log(monthlyCalendar.calendarDateList.length,rosterData.rosterList['ITO1_1999-01-01'].shiftList.length);

    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }
    let updateShiftData=(e)=>{
        //console.log(e.target.textContent,e.target.cellIndex);
        //console.log(rosterData);
        let realIndex=e.target.cellIndex-systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(rosterData));
        
        //console.log("0:"+realIndex+","+JSON.stringify(temp.rosterList[props.itoId].shiftList));
        if (e.target.textContent===null){
            temp.rosterList[props.itoId].shiftList[realIndex]="";
        }else {
            temp.rosterList[props.itoId].shiftList[realIndex]=e.target.textContent;
        }
        //console.log("1:"+realIndex+","+JSON.stringify(temp.rosterList[props.itoId].shiftList));
        setRosterData(temp);
    }
    if (isHighLightRow){
        cellList.push(<RosterNameCell className="highlightCell" key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }else{
        cellList.push(<RosterNameCell key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }
    if (previousMonthShift){
        for (i=systemParam.maxConsecutiveWorkingDay-systemParam.noOfPrevDate;i<previousMonthShift.length;i++){
            cellList.push(<ShiftCell key={"prev-"+i}>{previousMonthShift[i]}</ShiftCell>);
        }
    } else {
        for (i=0;i<systemParam.noOfPrevDate;i++){
            cellList.push(<ShiftCell key={"prev-"+i}/>);
        }
    }
    
    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        cellList.push(
            <EditableShiftCell 
                itoid={props.itoId}
                key={props.itoId+"_shift_"+i}
                onBlur={updateShiftData}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                {rosterRowData.shiftList[i]}
            </EditableShiftCell>
        );
    }
    
    for (let j=i;j<31;j++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+j}>{rosterRowData.shiftList[j]}</BorderedAlignCenterCell>);
    }
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_totalHour"}>{rosterRowData.totalHour}</BorderedAlignCenterCell>);
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_actualHour"}>{rosterRowData.actualHour}</BorderedAlignCenterCell>);
    cellList.push(
        <EditableBalanceCell
            key={props.itoId+"_lastMonthBalance"}>
            {rosterRowData.lastMonthBalance}
        </EditableBalanceCell>
    );
    cellList.push(
        <EditableBalanceCell key={props.itoId+"_thisMonthHourTotal"}>
            {rosterRowData.thisMonthHourTotal}
        </EditableBalanceCell>
    );
    cellList.push(
        <EditableBalanceCell key={props.itoId+"_thisMonthBalance"}>
            {rosterRowData.thisMonthBalance}
        </EditableBalanceCell>
    );

    cellList.push(<ShiftCountCell key={props.itoId+"_aShiftCount"}>{rosterRowData.aShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_bxShiftCount"}>{rosterRowData.bxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell  key={props.itoId+"_cShiftCount"}>{rosterRowData.cShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_dxShiftCount"}>{rosterRowData.dxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_noOfWorkingDay"} className="tailCell">{rosterRowData.noOfWorkingDay}</ShiftCountCell>);
    return(
        <tr>            
            {cellList}
        </tr>
    )
}