const CursorFeature=(Component,props)=>{
    function deHightLight (e){
        console.log("Bye");
    }
    function hightLight(e){
        console.log("Hi");
    }
    return(
        <Component
            onMouseOut={deHightLight}
            onMouseOver={hightLight}>
            {props.children}
        </Component>    
    )
}
export default CursorFeature