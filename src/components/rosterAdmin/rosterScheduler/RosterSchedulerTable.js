import ButtonPanel from './buttonPanel/ButtonPanel';
import RosterWebContext from '../../../utils/RosterWebContext';
import RosterSchedulerBody from './RosterSchedulerBody';
import TableFooter from '../../tableFooter/TableFooter';
import TableHeader from '../../tableHeader/TableHeader';
import useRosterMonth from './useRosterMonth';
import YearlyRosterStatistic from './yearlyRosterStatistic/YearlyRosterStatistic';
export default function RosterSchedulerTable(props){
    let buttonPanel=<ButtonPanel/>
    let [contextValue,updateContext]=useRosterMonth(props);
    let yearlyStat=<YearlyRosterStatistic/>;
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={[contextValue,updateContext]}>
                {contextValue.monthlyCalendar && <TableHeader noOfPrevDate={props.systemParam.noOfPrevDate}/>}
                {contextValue.undoableRosterSchedulerList && <RosterSchedulerBody/>}
                {contextValue.yearlyRosterStatistic && 
                    <TableFooter
                        buttonPanel={buttonPanel}
                        noOfPrevDate={props.systemParam.noOfPrevDate}
                        yearlyStat={yearlyStat}
                    />
                }    
            </RosterWebContext.Provider>
        </table>
    )
}