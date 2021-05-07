import RosterWebContext from '../../../utils/RosterWebContext';
import RosterSchedulerBody from './RosterSchedulerBody';
import TableHeader from '../../tableHeader/TableHeader';
import useRosterMonth from './useRosterMonth';
export default function RosterSchedulerTable(props){
    let contextValue=useRosterMonth(props);
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={props.systemParam.noOfPrevDate}/>
                <RosterSchedulerBody/>
            </RosterWebContext.Provider>
        </table>
    )
}