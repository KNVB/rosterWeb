import {useContext,useEffect,useState} from 'react';
import {SytemContext} from '../../../SystemContext';
import parse from 'html-react-parser';
import EditableShiftCell from '../../cells/editableShiftCell/EditableShiftCell';
import NameCell from '../../cells/nameCell/NameCell';
import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
export default function RosterSchedulerRow(props){
    const [hightLightRowIndex,setHightLightRowIndex]=useState(-1);
    const systemParam = useContext(SytemContext);
    console.log(props);

    return(
        <tr><td></td></tr>
    )
    /*
    const[itoRoster,setITORoster]=useState(props.itoRoster);
    const[shiftList,setShiftList]=useState(props.itoRoster.shiftList);
   
    let content,shiftCellList=[];
    
    
    useEffect(()=>{
        content=parse(itoRoster.itoName+"<br>"+itoRoster.itoPostName+" Extn. 2458");
        let j=0;
        for (let i=systemParam.noOfPrevDate;i>0;i--){
            shiftCellList.push(
                <ShiftCell
                    key={props.itoId+"_shift-"+i}
                    shiftInfoList={props.shiftInfoList}/>    
            )
        }
    
        shiftCellList.push(
            <EditableShiftCell 
                key={props.itoId+"_shift_"+j}                            
                setHightLightCellIndex={props.setHightLightCellIndex}
                setHightLightRowIndex={setHightLightRowIndex}
                shiftType={shiftList[0]}
                shiftInfoList={props.shiftInfoList}
                updateCount={updateCount}>
            </EditableShiftCell>);
        for (let i=shiftList.length;i<31;i++){
            shiftCellList.push(<RosterTableCell key={props.itoId+"_shift_"+i} />);
        }
    },[shiftList]);    
    
    function updateCount(cellIndex,shiftType){
        console.log("update count:"+(cellIndex-systemParam.noOfPrevDate-1)+","+shiftType);
        let temp=[];
        shiftList.forEach(shift=>{
            temp.push(shift);
        })
        temp[cellIndex-systemParam.noOfPrevDate-1]=shiftType;
        setShiftList(temp);
    }
    return(
        <tr>
            <NameCell hightLightRowIndex={hightLightRowIndex}>
                {content}
            </NameCell>
            {shiftCellList}
            <RosterTableCell className="text-center">
                {itoRoster.totalHour}
            </RosterTableCell>
            <RosterTableCell className="text-center">
                {itoRoster.actualHour}
            </RosterTableCell>
            <ShiftCountCell>
                {itoRoster.aShiftCount}
            </ShiftCountCell>
        </tr>
    );
    */
}