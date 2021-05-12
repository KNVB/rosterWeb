import './NameCell.css';
import BorderedCell from './BorderedCell';
export default function NameCell(props){
    let cssClassList=["nameCell","pb-0","pl-1","pt-0"];
    if (props.className){
        props.className.split(' ').forEach(className=>{
        cssClassList.push(className);
        })
    }    
    return (
        <BorderedCell className={cssClassList.join(' ')}>
            {props.children}
        </BorderedCell>    
    )
}
