import BorderedCell from '../borderedCell/BorderedCell';
export default function BorderedAlignCenterCell(props){
    let myProps={};
    Object.keys(props).forEach(key=>{
      myProps[key]=props[key];
    })    
    return(
      <BorderedCell {...myProps} className={props.className+" text-center"}>
        {props.children}
      </BorderedCell>
    )
}