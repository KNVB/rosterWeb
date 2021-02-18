import {useContext} from 'react';
import RosterWebContext from '../../../../../RosterWebContext';
import BorderedAlignCenterCell from '../../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function CursorCell(props){
    let { setHightLightCellIndex,setHighLightRowIndex } = useContext(RosterWebContext);
 
    let deHightLight = e => {
        //props.setIstHightLightRow(false);
        setHightLightCellIndex(-1);
        setHighLightRowIndex();
    };
    let hightLight = e => {
        //console.log(e.target.cellIndex);
        //props.setIstHightLightRow(true);
        setHightLightCellIndex(e.target.cellIndex);
        setHighLightRowIndex({itoId:props.itoId,rowType:props.rowType});
    };

    return(
        <BorderedAlignCenterCell
            onMouseOut={deHightLight}
            onMouseOver={hightLight}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}