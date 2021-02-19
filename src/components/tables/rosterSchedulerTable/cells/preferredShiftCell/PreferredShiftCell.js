import BorderedAlignCenterCell from '../../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import Utility from '../../../../../utils/Utility';
export default function PreferredShiftCell(props){
    let GG=Utility.withCursor(BorderedAlignCenterCell);
    return <GG {...props}>{props.children}</GG>;
}