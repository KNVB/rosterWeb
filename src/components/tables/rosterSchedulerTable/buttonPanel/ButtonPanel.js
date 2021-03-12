import "./ButtonPanel.css";
import {useContext} from 'react';
import {Col,Container,Row} from 'react-bootstrap';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../RosterWebContext';
import Utility from '../../../../utils/Utility';
export default function ButtonPanel(){
    let {activeShiftInfoList,monthlyCalendar,orgRosterData,rosterData,rosterMonth,setRosterData} = useContext(RosterWebContext);
    async function reload(){
        /*
        console.log(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList);
        console.log(rosterData.rosterList['ITO1_1999-01-01'].shiftList);
        */
        setRosterData(orgRosterData);
    }
    function clearAllShiftData(){
        let temp=JSON.parse(JSON.stringify(rosterData));
        let rosterList=temp.rosterList;
        /*
        console.log(JSON.stringify(rosterData));
        console.log("0temp="+JSON.stringify(temp.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("0org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("0current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
        */
        Object.keys(rosterList).forEach(itoId=>{
            let roster=rosterList[itoId];
            roster.shiftList={};
            temp.rosterList[itoId]=roster;
            Utility.calculateITOMonthlyStat(temp.rosterList[itoId],monthlyCalendar.noOfWorkingDay,activeShiftInfoList);
        });
        temp.duplicateShiftList=Utility.getDuplicateShiftList(monthlyCalendar,rosterList);
        
        /*
        console.log("1temp="+JSON.stringify(temp.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("1org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
        console.log("1current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
        */
        setRosterData(temp);
    }
    async function saveRosterToDB(){
        
        let roster=new Roster();
        
        roster.saveRosterToDB({
            month:rosterMonth.getMonth()+1,
            preferredShiftList:rosterData.preferredShiftList,
            rosterList:rosterData.rosterList,
            year:rosterMonth.getFullYear(),
        })
        .then(updateResult=>{
            if (updateResult.result){
                alert("Update Success");
            } else {
                //return updateResult;
                console.log(updateResult);
            }
        })
        .catch(error=>{
            alert(error.message);
            //console.log("ButtonPanel Exception Caught");
            //console.log(error);
        });
        roster=null;
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
                    <div className="saveRosterToDBButton" onClick={saveRosterToDB}>
                        Save all data to DB
                    </div>
                </Col>
            </Row>
        </Container> 
    )
}