import RosterWebContext from '../../utils/RosterWebContext';
import RosterViewerBody from './RosterViewerBody';
import TableHeader from '../tableHeader/TableHeader';
import TableFooter from '../tableFooter/TableFooter';
import useRosterMonth from './useRosterMonth';
export default function RosterViewerTable(props){
    let [contextValue, updateContext]=useRosterMonth(props);
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={[contextValue, updateContext]}>
                {contextValue.monthlyCalendar && <TableHeader noOfPrevDate={0}/>}
                {contextValue.rosterList && <RosterViewerBody/>}
                {contextValue.activeShiftInfoList && <TableFooter noOfPrevDate={0}/>}
            </RosterWebContext.Provider>
        </table>    
    )
}