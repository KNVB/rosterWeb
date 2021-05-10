import RosterWebContext from '../../../utils/RosterWebContext';
import VVBody from './VVBody';
import VVFooter from './VVFooter';
import VVHeader from './vvHeader/VVHeader';
import './VVTable.css';
import useRosterMonth from './useRosterMonth';
export default function VVTable(props){
    let contextValue=useRosterMonth(props);
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                {contextValue.monthlyCalendar && <VVHeader/>}
                {contextValue.undoableRosterList && <VVBody/>}
                {contextValue.activeShiftInfoList&&<VVFooter/>}
            </RosterWebContext.Provider>
        </table>    
    )
}