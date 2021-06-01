import './XXFooter.css';
import ShiftLegend from './ShiftLegend';
export default function XXFooter(props){
    //console.log(useContext(RosterWebContext))
    let columnCount=props.noOfPrevDate+42;
    return (
        <tfoot className="tableFooter">
            <tr><td colSpan={columnCount}><br/></td></tr>
            <tr>
                <td colSpan={11} className="align-top">
                    <ShiftLegend/>
                </td>
                <td  className="align-top pl-1 pr-1 text-center" colSpan={(columnCount-11-10)} rowSpan="10">
                    {props.autoPlanner}
                </td>
                <td  className="align-top" colSpan={10} rowSpan="20">
                    {props.yearlyStat}
                </td>                                
            </tr>
            <tr>
                <td colSpan={(columnCount-10)}>
                    {props.buttonPanel}
                </td>
            </tr>
        </tfoot>      
    )
}