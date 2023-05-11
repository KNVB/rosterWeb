import "./YearlyRosterStaticTable.css";
export default function YearlyRosterStatisticTable({ yearlyRosterStatistic }) {
    //console.log(yearlyRosterStatistic);
    let rowList = [];
    Object.keys(yearlyRosterStatistic.statistic).forEach(itoId => {
        let dataRow = yearlyRosterStatistic.statistic[itoId];
        rowList.push(
            <tr key={itoId + "_0"}>
                <td className="borderCell">{dataRow.postName}</td>
                <td className="borderCell">{dataRow.aTotal}</td>
                <td className="borderCell">{dataRow.bxTotal}</td>
                <td className="borderCell">{dataRow.cTotal}</td>
                <td className="borderCell">{dataRow.dxTotal}</td>
                <td className="borderCell">{dataRow.oTotal}</td>
                <td className="borderCell">{dataRow.totalCount}</td>
            </tr>
        );
        for (let i = 0; i < yearlyRosterStatistic.month; i++) {
            let dataRow = yearlyRosterStatistic.statistic[itoId];
            rowList.push(
                <tr key={itoId + "_" + (i+1)}>
                    <td className="borderCell">{i+1}</td>
                    <td className="borderCell">{dataRow[i+1].a}</td>
                    <td className="borderCell">{dataRow[i+1].b}</td>
                    <td className="borderCell">{dataRow[i+1].c}</td>
                    <td className="borderCell">{dataRow[i+1].d}</td>
                    <td className="borderCell">{dataRow[i+1].o}</td>
                    <td className="borderCell">{dataRow[i+1].total}</td>
                </tr>);
        }
    })

    return (
        <div className="yearlyRosterStatistic">
            <table className="yearlyRosterStatisticTable">
                <thead>
                    <tr>
                        <td className="borderCell">ITO</td>
                        <td className="borderCell">a</td>
                        <td className="borderCell">bx</td>
                        <td className="borderCell">c</td>
                        <td className="borderCell">dx</td>
                        <td className="borderCell">O</td>
                        <td className="borderCell">Total</td>
                    </tr>
                </thead>
                <tbody>
                    {rowList}
                </tbody>
            </table>
        </div>
    )
}