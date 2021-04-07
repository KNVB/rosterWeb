export default function QQCell(props){
    let cssClassName="QQ";
    function mouseDownHandler(e){

    }
    function mouseEnterHandler(e){
        props.onMouseEnter(e);
    }
    return (
        <td 
            className={cssClassName}
            contentEditable={true}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
                {props.children}
        </td>
    )
}