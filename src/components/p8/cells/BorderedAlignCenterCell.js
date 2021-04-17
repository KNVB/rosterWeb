import BorderedCell from './borderedCell/BorderedCell';
export default function BorderedAlignCenterCell(props){
  let cssClass="text-center"+((props.className)?" "+props.className:"");
  //console.log("cssClass="+cssClass);
  return(
    <BorderedCell {...props} className={cssClass}>
      {props.children}
    </BorderedCell>
  )
}