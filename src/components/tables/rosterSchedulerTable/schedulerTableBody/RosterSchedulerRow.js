import { useContext, useEffect,useState } from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import CursoredShiftCell from '../../cells/cursoredShiftCell/CursoredShiftCell';
import Parser from "html-react-parser";
import RosterNameCell from '../../cells/rosterNameCell/RosterNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import Utility from '../../../../utils/Utility';
export default function RosterSchedulerRow(props) {
    let { activeShiftInfoList, monthlyCalendar, rosterData, systemParam } = useContext(RosterWebContext);
    
    const [cellList, setCellList] = useState([]);
    const[roster,setRosterList]=useState(rosterData.rosterList[props.itoId]);
    useEffect(()=>{
        let j;
        let temp=[];
        let rosterRowData=Utility.calculateShiftStat(monthlyCalendar.noOfWorkingDay,roster,activeShiftInfoList);
        let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
        temp.push(<RosterNameCell>{itoNameContact}</RosterNameCell>);
        let previouseMonthShift=rosterData.previousMonthShiftList[props.itoId];
        for (j=systemParam.maxConsecutiveWorkingDay-systemParam.noOfPrevDate;j<previouseMonthShift.length;j++){
            temp.push(<ShiftCell key={"prev-"+j}>{previouseMonthShift[j]}</ShiftCell>);
        }
        for (j=0;j<31;j++){
            if (rosterRowData.shiftList[j]){
                temp.push(<CursoredShiftCell itoId={props.itoId} rowType="rosterRow" key={props.itoId+"_shift_"+j}>{rosterRowData.shiftList[j]}</CursoredShiftCell>);
            }else {
                temp.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+j}>{rosterRowData.shiftList[j]}</BorderedAlignCenterCell>);
            }
        }
        temp.push(<BorderedAlignCenterCell>
            {rosterRowData.totalHour}
            </BorderedAlignCenterCell>);
            temp.push(<BorderedAlignCenterCell>
            {rosterRowData.actualHour}
            </BorderedAlignCenterCell>);
            temp.push(<BalanceCell>
            {rosterRowData.lastMonthBalance}
            </BalanceCell>);
            
            temp.push(<BalanceCell>
            {rosterRowData.thisMonthHourTotal}
            </BalanceCell>);
            
            temp.push(<BalanceCell>
            {rosterRowData.thisMonthBalance}
            </BalanceCell>);
            
            temp.push(<ShiftCountCell>
            {rosterRowData.aShiftCount}
            </ShiftCountCell>);
            
            temp.push(<ShiftCountCell>
            {rosterRowData.bxShiftCount}
            </ShiftCountCell>);
            
            temp.push(<ShiftCountCell>
            {rosterRowData.cShiftCount}
            </ShiftCountCell>);
            
            temp.push(<ShiftCountCell>
                {rosterRowData.dxShiftCount}
            </ShiftCountCell>);
            
            temp.push(<ShiftCountCell className="tailCell">
            {rosterRowData.noOfWorkingDay}
            </ShiftCountCell>)
        setCellList(temp);
    },[roster,rosterData.previousMonthShiftList])
    return (
        <tr>
            {cellList}            
        </tr>
    );
}