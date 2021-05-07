import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
export default function ShiftLegend(){
    let {activeShiftInfoList} = useContext(RosterWebContext);
    let rowList=[];
    if (activeShiftInfoList){
        rowList.push(
            <tr key="aShift">
                <td className={activeShiftInfoList['a'].cssClassName}>
                    a : {activeShiftInfoList['a'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="bShift">
                <td className={activeShiftInfoList['b'].cssClassName}>
                    b : {activeShiftInfoList['b'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="b1Shift">
                <td className={activeShiftInfoList['b1'].cssClassName}>
                    b1 : {activeShiftInfoList['b1'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="cShift">
                <td className={activeShiftInfoList['c'].cssClassName}>
                    c : {activeShiftInfoList['c'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="dShift">
                <td className={activeShiftInfoList['d'].cssClassName}>
                    d : {activeShiftInfoList['d'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="d1Shift">
                <td className={activeShiftInfoList['d1'].cssClassName}>
                    d1 : {activeShiftInfoList['d1'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="d2Shift">
                <td className={activeShiftInfoList['d2'].cssClassName}>
                    d2 : {activeShiftInfoList['d2'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="d3Shift">
                <td className={activeShiftInfoList['d3'].cssClassName}>
                    d3 : {activeShiftInfoList['d3'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="sShift">
                <td className={activeShiftInfoList['s'].cssClassName}>
                    s: {activeShiftInfoList['s'].timeSlot}
                </td>
            </tr>
        )
        rowList.push(
            <tr key="oShift">
                <td className={activeShiftInfoList['O'].cssClassName}>
                    O: {activeShiftInfoList['O'].timeSlot}
                </td>
            </tr>
        )
    }
    return(
        <table width="100%">
            <tbody>
                {rowList}
            </tbody>
        </table>
    )
}