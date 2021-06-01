import './AutoPlannerTable.css';
import {useContext,useEffect, useState} from 'react';
import AutoPlanner from '../utils/AutoPlanner';
import RosterWebContext from '../../utils/RosterWebContext';
import { Fragment } from 'react';
export default function AutoPlannerTable(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let [autoPlanEndDate,setAutoPlanEndDate]=useState(1);
    let [autoPlanStartDate,setAutoPlanStartDate]=useState(1);
    let [autoPlanResult,setAutoPlanResult]=useState();
    let [iterationCount,setIterationCount]=useState('');
    let autoPlanStartDateList=[],autoPlanEndDateList=[];
    let [autoPlanResultSDList,setAutoPlanResultSDList]=useState([]);
    let [autoPlanResultVSList,setAutoPlanResultVSList]=useState([]);

    let monthLength=contextValue.monthlyCalendar.calendarDateList.length;
   
    let startAutoPlanner=async (e)=>{
        //
        if (iterationCount!==''){
            updateContext({type:'showLoadingImage',value:true});
            let autoPlanner=new AutoPlanner(contextValue);
            let result=await autoPlanner.getResult(autoPlanStartDate,autoPlanEndDate,iterationCount);
            setAutoPlanResult(result);
            updateContext({type:'showLoadingImage',value:false});
        }
    }
    useEffect(()=>{
        if (autoPlanResult){
            console.log(autoPlanResult);
            let temp1=[],temp2=[];
            for (let i=0;i<3;i++){
                temp1.push(
                    <div className="clickable" key={"SD_"+i}>
                        SD:{autoPlanResult.minSDList[i].avgStdDev} &nbsp;&nbsp;&nbsp; Vacant Shift Count:{autoPlanResult.minSDList[i].vacantShiftCount}
                    </div>
                );
                temp2.push(
                    <div className="clickable" key={"VS_"+i}>
                        Vacant Shift Count:{autoPlanResult.minVSList[i].vacantShiftCount} &nbsp;&nbsp;&nbsp;SD:{autoPlanResult.minVSList[i].avgStdDev}
                    </div>
                )
            }
            setAutoPlanResultSDList(temp1);
            setAutoPlanResultVSList(temp2);
        }
    },[autoPlanResult])
    useEffect(()=>{
        setAutoPlanEndDate(autoPlanStartDate);
    },[autoPlanStartDate])
    for (let i=0;i<monthLength;i++){
        autoPlanStartDateList.push(<option key={"startDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
        autoPlanEndDateList.push(<option key={"endDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
    }
    
    return (
        <form onSubmit={e=>e.preventDefault()}>
            <table className="autoPlannerTable" border="1">
                <tbody>
                    <tr>
                        <td className="text-right w-50">
                            Auto Planning Start From:
                        </td>
                        <td className="text-left w-50">
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
                        <td className="text-right">Iteration Count:</td>
                        <td  className="text-left">
                            <input 
                                onChange={e=>setIterationCount(+e.target.value)}
                                name='iterationCount' 
                                required 
                                type="number" 
                                value={iterationCount}/>
                            &nbsp;<button className="autoPlannerButton" onClick={startAutoPlanner}>Auto Planner</button>
                        </td>
                    </tr>
            { autoPlanResult &&
                <Fragment>
                    <tr>
                        <td colSpan="2">Auto Plan Result</td>
                    </tr>
                    <tr>
                        <td>
                            Auto Plan Result Sort By SD:<br/>
                            {autoPlanResultSDList}
                        </td>
                        <td>
                            Auto Plan Result Sort By Vacant Shift Count:<br/>
                            {autoPlanResultVSList}
                        </td>
                    </tr>
                </Fragment>
            }
                </tbody>
            </table>
        </form>
    );
}