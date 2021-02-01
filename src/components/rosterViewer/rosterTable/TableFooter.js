import './TableFooter.css';
function TableFooter(){
    return (
        <tfoot className="tableFooter">
            <tr>
                <td colSpan="44"><br/></td>
            </tr>
            <tr>
                <td colSpan="11" className="aShiftColor">a : 0800H - 1700H</td>
                <td colSpan="21" rowSpan="10" id="autoScheduler" style={{"verticalAlign":"top"}}></td>
                <td colSpan="10" rowSpan="20" id="yearlyStat"  style={{"verticalAlign":"top"}}></td>
            </tr>
            <tr>
                <td colSpan="11" className="bShiftColor">b : 1630H - 2215H</td>
            </tr>
            <tr>
                <td colSpan="11" className="bShiftColor">b1 : 1500H - 2215H</td>
            </tr>
            <tr>
                <td colSpan="11" className="cShiftColor">c : 2145H - 0830H (the next day)</td>
            </tr>
            <tr>
                <td colSpan="11" className="dShiftColor">d : 0800H - 1800H (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className="dShiftColor">d1 : 0800H - 1700H (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className="dShiftColor">d2 : 0900H - 1800H (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className="dShiftColor">d3 : 0800H - 1648H (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className="sickLeaveColor">s : sick leave standby</td>
            </tr>
            <tr>
                <td colSpan="11" className="oShiftColor">O : dayoff</td>
            </tr>
        </tfoot>
      
    )
}
export default TableFooter;