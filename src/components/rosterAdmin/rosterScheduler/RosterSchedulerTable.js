import ButtonPanel from './buttonPanel/ButtonPanel';
import RosterWebContext from '../../../utils/RosterWebContext';
import RosterSchedulerBody from './RosterSchedulerBody';
import TableFooter from '../../tableFooter/TableFooter';
import TableHeader from '../../tableHeader/TableHeader';
import useRosterMonth from './useRosterMonth';
import YearlyRosterStatistic from './yearlyRosterStatistic/YearlyRosterStatistic';
export default function RosterSchedulerTable(props){
    let buttonPanel=<ButtonPanel/>
    let contextValue=useRosterMonth(props);
    let yearlyStat=<YearlyRosterStatistic/>;
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={props.systemParam.noOfPrevDate}/>
                <RosterSchedulerBody/>
                <TableFooter
                    buttonPanel={buttonPanel}
                    noOfPrevDate={props.systemParam.noOfPrevDate}
                    yearlyStat={yearlyStat}
                />
            </RosterWebContext.Provider>
        </table>
    )
}