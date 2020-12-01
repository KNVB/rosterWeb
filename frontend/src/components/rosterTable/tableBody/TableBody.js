import RosterRows from './RosterRows';
function TableBody(props){
    return (
        <tbody>
            <RosterRows rosterYear={props.rosterYear} rosterMonth={props.rosterMonth}/>
        </tbody>
    )
}
export default TableBody;