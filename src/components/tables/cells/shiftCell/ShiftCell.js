import RosterTableCell from '../rosterTableCell/RosterTableCell';
import './ShiftCell.css';
function ShiftCell(props){
    let shiftClass="p-0 text-center shiftCell";
    let myProps={};
    //shiftInfoList={props.shiftInfoList}
    //console.log(props);
    
    Object.keys(props).forEach(key=>{
      if (key==="shiftInfoList"){
        shiftClass+=" "+props.shiftInfoList[props.children].cssClassName;
      }else{
        myProps[key]=props[key];
      }        
    })
    return (
        <RosterTableCell {...myProps}
            className={shiftClass}>
            {props.children}
        </RosterTableCell>
    )
}
export default ShiftCell;