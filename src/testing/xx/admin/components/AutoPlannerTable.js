import './AutoPlannerTable.css';
import {useContext,useState} from 'react';
import AutoPlanner from '../utils/AutoPlanner';
import RosterWebContext from '../../utils/RosterWebContext';
export default function AutoPlannerTable(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let [autoPlanEndDate,setAutoPlanEndDate]=useState(1);
    let [autoPlanStartDate,setAutoPlanStartDate]=useState(1);
    let autoPlanStartDateList=[],autoPlanEndDateList=[];
    let monthLength=contextValue.monthlyCalendar.calendarDateList.length;
   
    let startAutoPlanner=async (e)=>{
        //updateContext({type:'showLoadingImage',value:true});
        let autoPlanner=new AutoPlanner(contextValue);
        let result=await autoPlanner.getResult(autoPlanStartDate,autoPlanEndDate);
        console.log(result);
    }
    
    for (let i=0;i<monthLength;i++){
        autoPlanStartDateList.push(<option key={"startDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
        autoPlanEndDateList.push(<option key={"endDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
    }
    
    return (
        <table className="autoPlannerTable">
            <tbody>
                <tr>
                    <td>
                        Auto Planning Start From:
                    </td>
                    <td colSpan="3">
                        <select 
                            onChange={e => setAutoPlanStartDate(+e.target.value)}
                            name="autoPlanStartDate" 
                            value={autoPlanStartDate}>
                            {autoPlanStartDateList}
                        </select>
                        &nbsp;to&nbsp;
                        <select 
                            onChange={e => setAutoPlanEndDate(Math.max(+e.target.value, autoPlanStartDate))}
                            name="autoPlanEndDate" 
                            value={autoPlanEndDate}>
                            {autoPlanEndDateList}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Iteration Count:</td>
                    <td><input id="iterationCount" type="number"/></td>
                    <td colSpan="2">
                        &nbsp;<div className="autoPlannerButton" onClick={startAutoPlanner}>Auto Planner</div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">Standard Deviation:</td>
                    <td colSpan="2">Missing shift Count:</td>
                </tr>
                <tr id="theLowestSD">
                    <td>1</td><td>1</td>
                    <td>1</td><td>1</td>
                </tr>
                <tr id="thirdLowestSD">
                    <td>1</td><td></td>
                    <td colSpan="2"><br/></td>
                </tr>
                <tr id="theLowestMissingShiftCount">
                    <td>1</td><td>1</td>
                    <td>1</td><td>1</td>
                </tr>
            </tbody>
        </table>
    );
}