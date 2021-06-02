import './AutoPlannerTable.css';
import {useCallback,useContext,useEffect, useState} from 'react';
import AutoPlanner from '../utils/AutoPlanner';
import ITOShiftStatUtil from '../../utils/ITOShiftStatUtil';
import RosterWebContext from '../../utils/RosterWebContext';
import { Fragment } from 'react';
export default function AutoPlannerTable(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let [autoPlanEndDate,setAutoPlanEndDate]=useState(1);
    let [autoPlanStartDate,setAutoPlanStartDate]=useState(1);
    let [autoPlanResult,setAutoPlanResult]=useState();
    let [iterationCount,setIterationCount]=useState('');
    let [autoPlanResultList,setAutoPlanResultList]=useState({});
    
    let autoPlanStartDateList=[],autoPlanEndDateList=[];
    let monthLength=contextValue.monthlyCalendar.calendarDateList.length;

    let loadSDRoster=useCallback((index)=>{
        let {getITOStat}=ITOShiftStatUtil();
        let temp=JSON.parse(JSON.stringify(contextValue.itoRosterList.presentValue));
        let itoIdList=Object.keys(autoPlanResult.minSDList[index].itoRosterList);
        for (let i=0;i<itoIdList.length;i++){
            for (const [date,shift] of Object.entries(autoPlanResult.minSDList[index].itoRosterList[itoIdList[i]].shiftList)){
                //console.log(itoIdList[i]+",date="+date+",shift="+shift);
                temp[itoIdList[i]].shiftList[date]=shift;
            }
        }
        Object.keys(temp).forEach(itoId=>{
            temp[itoId]=getITOStat(contextValue.activeShiftInfoList,contextValue.monthlyCalendar.noOfWorkingDay,temp[itoId]);
        });
        contextValue.itoRosterList.set(temp);
        updateContext({type:'updateRosterData',value:contextValue.itoRosterList});
    },[autoPlanResult,contextValue,updateContext]);
    let loadVSRoster=useCallback((index)=>{
        let {getITOStat}=ITOShiftStatUtil();
        let temp=JSON.parse(JSON.stringify(contextValue.itoRosterList.presentValue));
        let itoIdList=Object.keys(autoPlanResult.minVSList[index].itoRosterList);

        for (let i=0;i<itoIdList.length;i++){
            for (const [date,shift] of Object.entries(autoPlanResult.minVSList[index].itoRosterList[itoIdList[i]].shiftList)){
                //console.log(itoIdList[i]+",date="+date+",shift="+shift);
                temp[itoIdList[i]].shiftList[date]=shift;
            }
        }
        Object.keys(temp).forEach(itoId=>{
            temp[itoId]=getITOStat(contextValue.activeShiftInfoList,contextValue.monthlyCalendar.noOfWorkingDay,temp[itoId]);
        });
        contextValue.itoRosterList.set(temp);
        updateContext({type:'updateRosterData',value:contextValue.itoRosterList});
    },[autoPlanResult,contextValue,updateContext]);        
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
            //console.log(autoPlanResult);
            let temp1=[],temp2=[];
            for (let i=0;i<autoPlanResult.minSDList.length;i++){
                //console.log(autoPlanResult.minVSList[i]);
                temp1.push(
                    <tr className="clickable" key={"SD_"+i} onClick={()=>loadSDRoster(i)}>
                        <td className="text-left pl-3">SD:{autoPlanResult.minSDList[i].avgStdDev}</td>
                        <td>Vacant Shift Count:{autoPlanResult.minSDList[i].vacantShiftCount}</td>
                    </tr>
                );
                temp2.push(
                    <tr className="clickable" key={"VS_"+i} onClick={()=>loadVSRoster(i)}>
                        <td className="text-left pl-3">Vacant Shift Count:{autoPlanResult.minVSList[i].vacantShiftCount}</td>
                        <td>SD:{autoPlanResult.minVSList[i].avgStdDev}</td>
                    </tr>
                )
            }
            let result={SDList:temp1,VSList:temp2}
            setAutoPlanResultList(result);
        }
    },[autoPlanResult,loadSDRoster,loadVSRoster])
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
                            Auto Plan Result Sort By SD:
                            <table className="w-100">
                                <tbody>
                                    {autoPlanResultList.SDList}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            Auto Plan Result Sort By Vacant Shift Count:<br/>
                            <table className="w-100">
                                <tbody>
                                    {autoPlanResultList.VSList}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </Fragment>
            }
                </tbody>
            </table>
        </form>
    );
}