import BorderedAlignCenterCell from '../../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import Utility from '../../../../../utils/Utility';
export default function PreferredShiftCell(props){
    let GG=Utility.withCursor(BorderedAlignCenterCell);
    let QQ=Utility.withEditable(GG);
    return <QQ {...props}>{props.children}</QQ>;
}