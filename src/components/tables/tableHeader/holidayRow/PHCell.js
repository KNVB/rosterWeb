import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function PHCell(props){
    return (
        <BorderedAlignCenterCell title={props.title} className="font-weight-bold p-0 phCell">
            {props.children}
        </BorderedAlignCenterCell>
    )
}