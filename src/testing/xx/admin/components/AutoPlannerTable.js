import './AutoPlannerTable.css';
import {useContext,useEffect, useState} from 'react';
import AutoPlanner from '../utils/AutoPlanner';
import RosterWebContext from '../../utils/RosterWebContext';
export default function AutoPlannerTable(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let [autoPlanEndDate,setAutoPlanEndDate]=useState(1);
    let [autoPlanStartDate,setAutoPlanStartDate]=useState(1);
    let [iterationCount,setIterationCount]=useState('');
    let autoPlanStartDateList=[],autoPlanEndDateList=[];
    let monthLength=contextValue.monthlyCalendar.calendarDateList.length;
   
    let startAutoPlanner=async (e)=>{
        //updateContext({type:'showLoadingImage',value:true});
        if (iterationCount!==''){
            let autoPlanner=new AutoPlanner(contextValue);
            let result=await autoPlanner.getResult(autoPlanStartDate,autoPlanEndDate,iterationCount);
            console.log(result);
        }
    }
    useEffect(()=>{
        setAutoPlanEndDate(autoPlanStartDate);
    },[autoPlanStartDate])
    for (let i=0;i<monthLength;i++){
        autoPlanStartDateList.push(<option key={"startDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
        autoPlanEndDateList.push(<option key={"endDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
    }
    
    return (
        <form onSubmit={e=>e.preventDefault()}>
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
                        <td>
                            <input 
                                onChange={e=>setIterationCount(+e.target.value)}
                                name='iterationCount' 
                                required 
                                type="number" 
                                value={iterationCount}/>
                        </td>
                        <td colSpan="2">
                            &nbsp;<button className="autoPlannerButton" onClick={startAutoPlanner}>Auto Planner</button>
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
        </form>
    );
}