import './TableFooter.css';
import ShiftLegend from './ShiftLegend';
export default function TableFooter(props){
    //console.log(useContext(RosterWebContext))
    let columnCount=props.noOfPrevDate+42;
    return (
        <tfoot className="tableFooter">
            <tr><td colSpan={columnCount}><br/></td></tr>
            <tr>
                <td colSpan="11" className="align-top">
                    <ShiftLegend/>
                </td>
                <td colSpan={(columnCount-11-10)} rowSpan="10">
                    {props.autoScheduler}
                </td>
                <td  className="align-top" colSpan={10} rowSpan="20">
                    {props.yearlyStat}
                </td>                                
            </tr>
            <tr>
                <td className="align-center" colSpan={(columnCount-10)}>
                    {props.buttonPanel}
                </td>
            </tr>
        </tfoot>      
    )
}