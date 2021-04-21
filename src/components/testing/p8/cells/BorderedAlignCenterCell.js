import BorderedCell from './borderedCell/BorderedCell';
export default function BorderedAlignCenterCell(props){
  let cssClass="text-center"+((props.className)?" "+props.className:"");
  //console.log("cssClass="+cssClass);
  let myProps=Object.assign({},props);
  delete myProps.setHightLightCellIndex
  return(
    <BorderedCell {...myProps} className={cssClass}>
      {props.children}
    </BorderedCell>
  )
}