import BorderedCell from '../borderedCell/BorderedCell';
export default function BorderedAlignCenterCell(props){
    return(
      <BorderedCell {...props} className={props.className+" text-center"}>
        {props.children}
      </BorderedCell>
    )
}