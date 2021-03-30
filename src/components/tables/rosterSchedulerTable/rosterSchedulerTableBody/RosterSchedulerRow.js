import {useContext,useState} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/BorderedAlignCenterCell';
import EditableBalanceCell from './cells/EditableBalanceCell';
import EditableShiftCell from './cells/editableShiftCell/EditableShiftCell';
import Parser from "html-react-parser";
import Roster from '../../../../utils/Roster';
import RosterNameCell from '../../cells/RosterNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import SelectedRegionUtil from '../../../../utils/SelectedRegionUtil';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';

export default function RosterSchedulerRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],i;
    let {
        activeShiftInfoList,
        monthlyCalendar,
        rosterData,
        selectedRegion,
        setHightLightCellIndex,
        setRosterData,
        systemParam
    } = useContext(RosterWebContext);
    //console.log(rosterData);
    //console.log("RosterSchedulerRow");
    //console.log(props.itoId+"_"+props.rowIndex);
    
    let roster=JSON.parse(JSON.stringify(rosterData.rosterList[props.itoId]));    
    let previousMonthShift=rosterData.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");

    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }
    let updateLastMonthBalance=(e)=>{
        if (isNaN(e.target.textContent)){
            alert("The last month balance must be a no.");
            e.target.focus();
        } else {
            let temp=JSON.parse(JSON.stringify(rosterData));//Don't use object.assign, which is shallow copy
            temp.rosterList[props.itoId].lastMonthBalance=parseFloat(e.target.textContent);
            Roster.updateThisMonthBalance(temp,props.itoId);
            setRosterData(temp);
        }
    }
    let updateShiftData=(e)=>{
        let realIndex=e.target.cellIndex-systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(rosterData));//Don't use object.assign, which is shallow copy
        
        //console.log("0:"+realIndex+","+JSON.stringify(temp.rosterList[props.itoId].shiftList));
        if (e.target.textContent===null){
            temp.rosterList[props.itoId].shiftList[realIndex]="";
        }else {
            temp.rosterList[props.itoId].shiftList[realIndex]=e.target.textContent;
        }
        //console.log("0:"+temp.rosterList[props.itoId].thisMonthBalance);
        temp.duplicateShiftList=Roster.getDuplicateShiftList(monthlyCalendar,temp.rosterList);
        Roster.calculateITOMonthlyStat(temp.rosterList[props.itoId],monthlyCalendar.noOfWorkingDay,activeShiftInfoList);        
        //console.log("1:"+temp.rosterList[props.itoId].thisMonthBalance);
        setRosterData(temp);
    }
    let updateThisMonthHourTotal=(e)=>{
        if (isNaN(e.target.textContent)){
            alert("The this month balance must be a no.");
            e.target.focus();
        } else {
            let temp=JSON.parse(JSON.stringify(rosterData));//Don't use object.assign, which is shallow copy
            temp.rosterList[props.itoId].thisMonthHourTotal=parseFloat(e.target.textContent);
            Roster.updateThisMonthBalance(temp,props.itoId);
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
        let cssClassName="";
        if (rosterData.duplicateShiftList[props.itoId].includes(i+1)){
            cssClassName="errorRedBlackGround"; 
        }        
        cssClassName+=" "+SelectedRegionUtil.getSelectedRegionCssClass(1+i+systemParam.noOfPrevDate,props.rowIndex,selectedRegion);
        cssClassName=cssClassName.trim();
        cellList.push(
            <EditableShiftCell 
                availableShiftList={roster.availableShiftList}
                className={cssClassName}
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
        <tr id={props.itoId+"_roster_scheduler_row"}>            
            {cellList}
        </tr>
    )
}