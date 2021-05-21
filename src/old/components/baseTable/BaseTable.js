import './BaseTable.css';
import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import TableHeader from './tableHeader/TableHeader';
export default function BaseTable(props){
    let [contextValue]=useContext(RosterWebContext);
    return(
        <table id="rosterTable">
            {contextValue.monthlyCalendar &&<TableHeader noOfPrevDate={props.noOfPrevDate}/>}
            {props.children}
        </table>
    );        
}