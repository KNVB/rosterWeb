import {useContext} from 'react';
import './RosterSchedulerTableFooter.js';
import ButtonPanel from '../buttonPanel/ButtonPanel';
import RosterWebContext from '../../../../RosterWebContext';
import YearlyRosterStatistic from '../yearlyRosterStatistic/YearlyRosterStatistic';
export default function RosterSchedulerTableFooter(props){
    let {activeShiftInfoList} = useContext(RosterWebContext);
    return (
        <tfoot className="tableFooter">
            <tr>
                <td colSpan="44"><br/></td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['a'].cssClassName}>a : {activeShiftInfoList['a'].timeSlot}</td>
                <td colSpan="23" rowSpan="10" id="autoScheduler" style={{"verticalAlign":"top"}}>
                    
                </td>
                <td colSpan="10" rowSpan="20" id="yearlyStat"  style={{"verticalAlign":"top"}}>
                    <YearlyRosterStatistic/>
                </td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['b'].cssClassName}>b : {activeShiftInfoList['b'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['b1'].cssClassName}>b1 : {activeShiftInfoList['b1'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['c'].cssClassName}>c : {activeShiftInfoList['c'].timeSlot} (the next day)</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['d'].cssClassName}>d : {activeShiftInfoList['d'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['d1'].cssClassName}>d1 : {activeShiftInfoList['d1'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['d2'].cssClassName}>d2 : {activeShiftInfoList['d2'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['d3'].cssClassName}>d3 : {activeShiftInfoList['d3'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['s'].cssClassName}>s :  {activeShiftInfoList['s'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={activeShiftInfoList['O'].cssClassName}>O :  {activeShiftInfoList['O'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="34">
                    <ButtonPanel/>
                </td>
            </tr>
        </tfoot>
      
    )
}