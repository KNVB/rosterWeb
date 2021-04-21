import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import './DateCell.css';
export default function DateCell(props){
    let cssClass="dateCell"+((props.className)?" "+props.className:"");
    return(
        <BorderedAlignCenterCell className={cssClass}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}