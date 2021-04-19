import BorderedAlignCenterCell from '../../cells/BorderedAlignCenterCell';
export default function WeekDayCell(props){
    return (
        <BorderedAlignCenterCell title={props.title} className={"p-0 "+props.className}>
            {props.children}
        </BorderedAlignCenterCell>    
    )
}
