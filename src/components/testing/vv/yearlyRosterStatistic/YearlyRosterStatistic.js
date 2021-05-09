import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import './YearlyRosterStatistic.css';
export default function YearlyRosterStatistic(){
    let {yearlyRosterStatistic}=useContext(RosterWebContext);
    let rowList=[];
    Object.keys(yearlyRosterStatistic).forEach(itoId=>{
        let aShiftTotal=0,bxShiftTotal=0,cShiftTotal=0,dxShiftTotal=0,oShiftTotal=0,finalTotal=0;
		let itoMonthlyStatistic=yearlyRosterStatistic[itoId].itoMonthlyStatisticList;
	
        for (let i=0;i<itoMonthlyStatistic.length;i++){
            aShiftTotal+=itoMonthlyStatistic[i].aShiftTotal;
            bxShiftTotal+=itoMonthlyStatistic[i].bxShiftTotal;
            cShiftTotal+=itoMonthlyStatistic[i].cShiftTotal;
            dxShiftTotal+=itoMonthlyStatistic[i].dxShiftTotal;
            oShiftTotal+=itoMonthlyStatistic[i].oShiftTotal;

            itoMonthlyStatistic[i].monthlyTotal=itoMonthlyStatistic[i].aShiftTotal+itoMonthlyStatistic[i].bxShiftTotal+itoMonthlyStatistic[i].dxShiftTotal+itoMonthlyStatistic[i].cShiftTotal+itoMonthlyStatistic[i].oShiftTotal;
        }
        finalTotal=oShiftTotal+cShiftTotal+aShiftTotal+dxShiftTotal+bxShiftTotal;
        rowList.push(
            <tr key={itoId+"_subtotal"}>
                <BorderedAlignCenterCell>{yearlyRosterStatistic[itoId].itoPostName}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell>{aShiftTotal}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell>{bxShiftTotal}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell>{cShiftTotal}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell>{dxShiftTotal}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell>{oShiftTotal}</BorderedAlignCenterCell>
                <BorderedAlignCenterCell className="tailCell">{finalTotal}</BorderedAlignCenterCell>
            </tr>
        )
        for (let i=0;i<itoMonthlyStatistic.length;i++){
            rowList.push(
                <tr key={itoId+"_"+i+"_stat"}>
                    <BorderedAlignCenterCell>{i+1}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell>{itoMonthlyStatistic[i].aShiftTotal}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell>{itoMonthlyStatistic[i].bxShiftTotal}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell>{itoMonthlyStatistic[i].cShiftTotal}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell>{itoMonthlyStatistic[i].dxShiftTotal}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell>{itoMonthlyStatistic[i].oShiftTotal}</BorderedAlignCenterCell>
                    <BorderedAlignCenterCell className="tailCell">{itoMonthlyStatistic[i].monthlyTotal}</BorderedAlignCenterCell>
                </tr>    
            );         
        }
    })
    return(
        <div id="yearlyStatisticDiv" className="yearlyStatisticReportDiv">
            <table id="yearlyStatisticTable">
                <tbody className="bottomCell">
                    <tr>
                        <BorderedAlignCenterCell>ITO</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell>a</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell>bx</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell>c</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell>dx</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell>O</BorderedAlignCenterCell>
                        <BorderedAlignCenterCell className="tailCell">Total</BorderedAlignCenterCell>
                    </tr>
                    {rowList}
                </tbody>
            </table>
        </div>
    )
}