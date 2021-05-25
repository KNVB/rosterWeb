import './AutoPlannerTable.css';
import {useContext,useRef,useState} from 'react';
import AutoPlanner from '../utils/AutoPlanner';
import RosterWebContext from '../../utils/RosterWebContext';
export default function AutoPlannerTable(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let [monthLength,setMonthLength]=useState(contextValue.monthlyCalendar.calendarDateList.length);
    let autoPlanStartDateList=[],autoPlanEndDateList=[];
    let formRef = useRef();
    let getShuffledItoIdList=(itoIdList)=>{
        return itoIdList.sort(() => Math.random() - 0.5);
    }
    let startAutoPlanner=async (e)=>{
        //updateContext({type:'showLoadingImage',value:true});
        let endDate=formRef.current.autoPlanEndDate.value;
        let startDate=formRef.current.autoPlanStartDate.value;
        let autoPlanner=new AutoPlanner(contextValue);
        let result=await autoPlanner.getResult(startDate,endDate);
        
    }
    let updateEndDate=(e)=>{
        setMonthLength(e.target.value);
    }
    for (let i=0;i<monthLength;i++){
        autoPlanStartDateList.push(<option key={"startDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
        autoPlanEndDateList.push(<option key={"endDate_"+(i+1)} value={(i+1)}>{(i+1)}</option>);
    }
    
    return (
        <form ref={formRef}>
            <table className="autoPlannerTable">
                <tbody>
                    <tr>
                        <td>
                            Auto Planning Start From:
                        </td>
                        <td colSpan="3">
                            <select name="autoPlanStartDate">
                                {autoPlanStartDateList}
                            </select>
                            &nbsp;to&nbsp;
                            <select onChange={updateEndDate} name="autoPlanEndDate" value={monthLength}>
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
        </form>
    );
}