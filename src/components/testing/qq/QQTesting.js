export default function QQTesting(props){
    console.log("Testing");
    console.log(props.rosterData['ITO1_1999-01-01'].shiftList["1"]);
    function goTest(){
        let temp=JSON.parse(JSON.stringify(props.rosterData));
        temp['ITO1_1999-01-01'].shiftList["1"]="b1"
        props.setRosterData(temp);
    }
    return (
        <button onClick={goTest}>Hello</button>
    )
}