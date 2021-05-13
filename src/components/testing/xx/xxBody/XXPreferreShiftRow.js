import {useContext} from 'react';
import BorderedCell from '../cell/BorderedCell';
import NameCell from '../cell/NameCell';
import PreferredShiftCell from '../cell/PreferredShiftCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import context from 'react-bootstrap/esm/AccordionContext';
export default function XXPreferreShiftRow(props){
    let cellList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedCell key={'pre_preshift_'+i}/>);
    }
    if(contextValue.preferredShiftList[props.itoId]){
        for (let i=0;i<31;i++){
            let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex);
            if (contextValue.preferredShiftList[props.itoId].presentValue[i+1]){
                
                cellList.push(
                    <PreferredShiftCell className={className} itoId={props.itoId} key={props.itoId+"_preferred_shift_"+i}>
                        {contextValue.preferredShiftList[props.itoId].presentValue[i+1]}
                    </PreferredShiftCell>
                );
            }else {
                cellList.push(<PreferredShiftCell className={className} itoId={props.itoId} key={props.itoId+"_preferred_shift_"+i}></PreferredShiftCell>);    
            }
        }
    }else {
        for (let i=0;i<31;i++){
            let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex);
            cellList.push(<PreferredShiftCell className={className} itoId={props.itoId} key={props.itoId+"_preferred_shift_"+i}></PreferredShiftCell>);
        }
    }
    return(
        <tr id={props.itoId+':preferredShift'}>
            <NameCell>Preferred Shift</NameCell>
            {cellList}
            <BorderedCell colSpan="5"/>
            <BorderedCell/>
            <BorderedCell/>
            <BorderedCell/>
            <BorderedCell/>
            <BorderedCell className="tailCell"/>
        </tr>
    )
}