import {useContext} from 'react';
import NameCell from './cells/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import ShiftCell from './cells/ShiftCell';
export default function JJRow(props){
    let cellList=[];
    let {activeShiftInfoList,monthlyCalendar,itoRosterList,systemParam}=useContext(RosterWebContext);
    let i,itoRoster=itoRosterList[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    cellList.push(<NameCell key={props.itoId + "_nameCell"}>{itoNameContact}</NameCell>);
    for (i=0;i<systemParam.noOfPrevDate;i++){
        cellList.push(<ShiftCell key={"prev-"+i}/>);
    }
    return(
        <tr id={props.itoId+"_roster_scheduler_row"}>            
            {cellList}
        </tr>
    )
}