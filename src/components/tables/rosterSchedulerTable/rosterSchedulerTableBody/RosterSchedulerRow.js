import {useContext,useState} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
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
    console.log("RosterSchedulerRow");
    let roster=Object.assign({},rosterData.rosterList[props.itoId]);    
    let previousMonthShift=rosterData.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
    Utility.calculateITOMonthlyStat(roster,monthlyCalendar.noOfWorkingDay,activeShiftInfoList)
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }
    let updateLastMonthBalance=(e)=>{
        let temp=Object.assign({},rosterData);
        if (!isNaN(e.target.textContent)){
            temp.rosterList[props.itoId].lastMonthBalance=parseFloat(e.target.textContent);
            setRosterData(temp);
        }        
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
    let updateThisMonthHourTotal=(e)=>{
        let temp=Object.assign({},rosterData);
        if (!isNaN(e.target.textContent)){
            temp.rosterList[props.itoId].thisMonthHourTotal=parseFloat(e.target.textContent);
            setRosterData(temp);
        }
    }
    
    //console.log(roster);
    if (isHighLightRow){
        cellList.push(<RosterNameCell className="highlightCell" key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }else{
        cellList.push(<RosterNameCell key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }
    if (previousMonthShift){
        for (i=systemParam.maxConsecutiveWorkingDay-systemParam.noOfPrevDate;i<previousMonthShift.length;i++){
            cellList.push(<ShiftCell availableShiftList={roster.availableShiftList} key={"prev-"+i}>{previousMonthShift[i]}</ShiftCell>);
        }
    } else {
        for (i=0;i<systemParam.noOfPrevDate;i++){
            cellList.push(<ShiftCell availableShiftList={roster.availableShiftList} key={"prev-"+i}/>);
        }
    }
    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        cellList.push(
            <EditableShiftCell 
                availableShiftList={roster.availableShiftList} 
                key={props.itoId+"_shift_"+i}
                onBlur={updateShiftData}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                {roster.shiftList[i+1]}
            </EditableShiftCell>
        );
    }
    for (let j=i;j<31;j++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+j}></BorderedAlignCenterCell>);
    }
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_totalHour"}>{roster.totalHour.toFixed(2)}</BorderedAlignCenterCell>);
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_actualWorkingHour"}>{roster.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>);
    
    cellList.push(
        <EditableBalanceCell
            key={props.itoId+"_lastMonthBalance"}
            onBlur={updateLastMonthBalance}>
            {roster.lastMonthBalance.toFixed(2)}
        </EditableBalanceCell>
    );
    cellList.push(
        <EditableBalanceCell 
            key={props.itoId+"_thisMonthHourTotal"}
            onBlur={updateThisMonthHourTotal}>
            {roster.thisMonthHourTotal.toFixed(2)}
        </EditableBalanceCell>
    );
    cellList.push(
        <BalanceCell key={props.itoId+"_thisMonthBalance"}>
            {roster.thisMonthBalance.toFixed(2)}
        </BalanceCell>
    );

    cellList.push(<ShiftCountCell key={props.itoId+"_aShiftCount"}>{roster.shiftCountList.aShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_bxShiftCount"}>{roster.shiftCountList.bxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_cShiftCount"}>{roster.shiftCountList.cShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_dxShiftCount"}>{roster.shiftCountList.dxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_actualNoOfWorkingDay"} className="tailCell">{roster.actualNoOfWorkingDay}</ShiftCountCell>);
    
    return(
        <tr>            
            {cellList}
        </tr>
    )
}