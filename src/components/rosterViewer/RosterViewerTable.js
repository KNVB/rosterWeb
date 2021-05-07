import RosterWebContext from '../../utils/RosterWebContext';
import RosterViewerBody from './RosterViewerBody';
import TableHeader from '../tableHeader/TableHeader';
import TableFooter from '../tableFooter/TableFooter';
import useRosterMonth from './useRosterMonth';
export default function RosterViewerTable(props){
    let contextValue=useRosterMonth(props);
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={0}/>
                <RosterViewerBody/>
                <TableFooter noOfPrevDate={0}/>
            </RosterWebContext.Provider>
        </table>    
    )
}