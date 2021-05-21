import './HourCell.css';
import BorderedAlignCenterCell from '../../cells/BorderedAlignCenterCell';
export default function HourCell(props){
    return (
        <BorderedAlignCenterCell className="hourCell p-0" rowSpan="2">
            {props.children}
        </BorderedAlignCenterCell>    
    )
}