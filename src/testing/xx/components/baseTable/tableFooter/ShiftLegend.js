import {useContext,useEffect} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function ShiftLegend(){
    let [contextValue] =useContext(RosterWebContext);
    let rowList=[];
    useEffect(()=>{
        
    },[contextValue.activeShiftInfoList])
    rowList.push(
        <tr key="aShift">
            <td className={contextValue.activeShiftInfoList['a'].cssClassName}>
                a : {contextValue.activeShiftInfoList['a'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="bShift">
            <td className={contextValue.activeShiftInfoList['b'].cssClassName}>
                b : {contextValue.activeShiftInfoList['b'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="b1Shift">
            <td className={contextValue.activeShiftInfoList['b1'].cssClassName}>
                b1 : {contextValue.activeShiftInfoList['b1'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="cShift">
            <td className={contextValue.activeShiftInfoList['c'].cssClassName}>
                c : {contextValue.activeShiftInfoList['c'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="dShift">
            <td className={contextValue.activeShiftInfoList['d'].cssClassName}>
                d : {contextValue.activeShiftInfoList['d'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="d1Shift">
            <td className={contextValue.activeShiftInfoList['d1'].cssClassName}>
                d1 : {contextValue.activeShiftInfoList['d1'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="d2Shift">
            <td className={contextValue.activeShiftInfoList['d2'].cssClassName}>
                d2 : {contextValue.activeShiftInfoList['d2'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="d3Shift">
            <td className={contextValue.activeShiftInfoList['d3'].cssClassName}>
                d3 : {contextValue.activeShiftInfoList['d3'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="sShift">
            <td className={contextValue.activeShiftInfoList['s'].cssClassName}>
                s: {contextValue.activeShiftInfoList['s'].timeSlot}
            </td>
        </tr>
    )
    rowList.push(
        <tr key="oShift">
            <td className={contextValue.activeShiftInfoList['O'].cssClassName}>
                O: {contextValue.activeShiftInfoList['O'].timeSlot}
            </td>
        </tr>
    )
    return(
        <table width="100%">
            <tbody>
                {rowList}
            </tbody>
        </table>
    )
}