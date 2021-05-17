import {useContext,useState} from 'react';
import BorderedCell from '../cell/BorderedCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import PreferredShiftCell from '../cell/PreferredShiftCell';
export default function PreferredShiftRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let [contextValue]=useContext(RosterWebContext);
    let cellList=[],nameCellCssClass="";
    for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedCell key={"prev-preferred_shift_"+i}/>);
    }
    for(let i=0;i<31;i++){
        let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex)
        cellList.push(
            <PreferredShiftCell
                className={className}
                itoId={props.itoId}
                rowIndex={props.rowIndex}
                key={props.itoId+"_preferred_shift_"+i}
                setIsHighLightRow={setIsHighLightRow}>
                {props.preferredShiftList[i+1]}
            </PreferredShiftCell>
        );        
    }
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }  
    return(
        <tr id={props.itoId+':preferredShift'}>
            <NameCell className={nameCellCssClass}>Preferred ShiftList</NameCell>
            {cellList}
            <BorderedCell colSpan="5"/>
            <BorderedCell />
            <BorderedCell />
            <BorderedCell />
            <BorderedCell />
            <BorderedCell className="tailCell"/>
        </tr>
    )
}