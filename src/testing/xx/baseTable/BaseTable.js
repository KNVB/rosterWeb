import './BaseTable.css';
import {useContext} from 'react';
import RosterWebContext from '../utils/RosterWebContext';
import TableFooter from './xxFooter/XXFooter';
import TableHeader from './tableHeader/TableHeader';
export default function BaseTable(props){
    let [contextValue]=useContext(RosterWebContext);
    return(
        <table id="rosterTable">
            {contextValue.monthlyCalendar &&<TableHeader noOfPrevDate={props.noOfPrevDate}/>}
            {props.children}
            {contextValue.activeShiftInfoList &&<TableFooter autoPlanner={props.autoPlanner} buttonPanel={props.buttonPanel} noOfPrevDate={props.noOfPrevDate} yearlyStat={props.yearlyStat}/>}
        </table>
    );        
}