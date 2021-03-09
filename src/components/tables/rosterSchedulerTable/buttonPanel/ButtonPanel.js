import "./ButtonPanel.css";
import {useContext} from 'react';
import {Col,Container,Row} from 'react-bootstrap';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../RosterWebContext';
import Utility from '../../../../utils/Utility';
export default function ButtonPanel(){
    let {calendarUtility,rosterMonth,rosterData,setRosterData} = useContext(RosterWebContext);
    async function reload(){
        let roster = new Roster();
        let newRosterData = await roster.getRosterSchedulerList(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
        let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
        newRosterData.duplicateShiftList=Utility.getDuplicateShiftList(monthlyCalendar,newRosterData.rosterList);
        setRosterData(newRosterData);
    }
    function clearAllShiftData(){
        let temp=Object.assign({},rosterData);
        let rosterList=temp.rosterList;
        Object.keys(rosterList).forEach(itoId=>{
            let roster=rosterList[itoId];
            roster.shiftList={};
            temp.rosterList[itoId]=roster;
        });
        setRosterData(temp);
    }
    return(
        <Container fluid={true}>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex justify-content-around">
                    <div className="reloadRoster" onClick={reload}>
                        Reload the roster
                    </div>
                    <div className="clearAllButton" onClick={clearAllShiftData}>
                        Clear All Shift Data
                    </div>
                    <div className="exportButton">
                        Export to Excel File
                    </div>
                    <div className="saveRosterToDBButton">
                        Save all data to DB
                    </div>
                </Col>
            </Row>
        </Container> 
    )
}