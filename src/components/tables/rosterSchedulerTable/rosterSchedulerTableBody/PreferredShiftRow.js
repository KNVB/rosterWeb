import {useContext,useState} from 'react';
import PreferredShiftCell from './cells/preferredShiftCell/PreferredShiftCell';
import PreferredShiftNameCell from './cells/preferredShiftNameCell/PreferredShiftNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function PreferredShiftRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],i;
    let {monthlyCalendar,rosterData,setHightLightCellIndex,setRosterData,systemParam} = useContext(RosterWebContext);
    let preferredShiftList=rosterData.preferredShiftList[props.itoId];
    //console.log(rosterData);
    
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }
    let updatePreferredShiftData=(e)=>{
        let realIndex=e.target.cellIndex-systemParam.noOfPrevDate;//no need minus 1
        let temp=JSON.parse(JSON.stringify(rosterData));
       
        if (e.target.textContent===null){
            if (temp.preferredShiftList[props.itoId][realIndex]){
                delete temp.preferredShiftList[props.itoId][realIndex];
            }
        }else {
            if (temp.preferredShiftList[props.itoId]===undefined){
                temp.preferredShiftList[props.itoId]={};
            }
            temp.preferredShiftList[props.itoId][realIndex]=e.target.textContent;
        }
        setRosterData(temp);
    }
    if (isHighLightRow){
        cellList.push(<PreferredShiftNameCell className="highlightCell" key={props.itoId + "_Preferred_Name_Cell"}/>);
    } else {
        cellList.push(<PreferredShiftNameCell key={props.itoId + "_Preferred_Name_Cell"}/>);
    }
    for (i=0;i<systemParam.noOfPrevDate;i++){
        cellList.push(<ShiftCell availableShiftList={rosterData.rosterList[props.itoId].availableShiftList} key={props.itoId+"_prev-"+i}/>);
    }
    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        if (preferredShiftList && preferredShiftList[i+1]){
            cellList.push(
                <PreferredShiftCell 
                    key={props.itoId+"_preferred_shift_"+i} 
                    onBlur={updatePreferredShiftData}
                    onMouseLeave={deHightLight}
                    onMouseEnter={hightLight}>
                    {preferredShiftList[i+1]}
                </PreferredShiftCell>
            );
        } else {
            cellList.push(
                <PreferredShiftCell 
                    key={props.itoId+"_preferred_shift_"+i} 
                    onBlur={updatePreferredShiftData} 
                    onMouseLeave={deHightLight}
                    onMouseEnter={hightLight}/>
            );
        }
    }
    for (let j=i;j<31;j++){
        cellList.push(<BorderedAlignCenterCell key={props.itoId+"_preferred_shift_"+j}/>);
    }
    return(
        <tr>
            
            {cellList}
            <BorderedAlignCenterCell colSpan="5"/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell/>
            <ShiftCountCell className="tailCell"/>            
        </tr>
    )
}