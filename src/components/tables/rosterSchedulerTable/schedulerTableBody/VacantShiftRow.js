import {useContext,useState} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
import VacantShiftNameCell from '../cells/vacantShiftNameCell/VacantShiftNameCell';
export default function VacantShiftRow(props){
    let {activeShiftInfoList,monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
    let cellList=[];
    let essentialShift=activeShiftInfoList.essentialShift;
    //console.log(activeShiftInfoList);
    //console.log(rosterData);
    return  <tr>
                <VacantShiftNameCell/>
                {cellList}
                <BorderedAlignCenterCell colSpan="5"/>
                <BorderedAlignCenterCell/>
                <BorderedAlignCenterCell/>
                <BorderedAlignCenterCell/>
                <BorderedAlignCenterCell/>
                <BorderedAlignCenterCell className="tailCell"/>      
            </tr>
}