import './TableFooter.css';
function TableFooter(props){
    return (
        <tfoot className="tableFooter">
            <tr>
                <td colSpan="44"><br/></td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['a'].cssClassName}>a : {props.shiftInfoList['a'].timeSlot}</td>
                <td colSpan="21" rowSpan="10" id="autoScheduler" style={{"verticalAlign":"top"}}></td>
                <td colSpan="10" rowSpan="20" id="yearlyStat"  style={{"verticalAlign":"top"}}></td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['b'].cssClassName}>b : {props.shiftInfoList['b'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['b1'].cssClassName}>b1 : {props.shiftInfoList['b1'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['c'].cssClassName}>c : {props.shiftInfoList['c'].timeSlot} (the next day)</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['d'].cssClassName}>d : {props.shiftInfoList['d'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['d1'].cssClassName}>d1 : {props.shiftInfoList['d1'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['d2'].cssClassName}>d2 : {props.shiftInfoList['d2'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['d3'].cssClassName}>d3 : {props.shiftInfoList['d3'].timeSlot} (on weekdays)</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['s'].cssClassName}>s :  {props.shiftInfoList['s'].timeSlot}</td>
            </tr>
            <tr>
                <td colSpan="11" className={props.shiftInfoList['O'].cssClassName}>O :  {props.shiftInfoList['O'].timeSlot}</td>
            </tr>
        </tfoot>
      
    )
}
export default TableFooter;