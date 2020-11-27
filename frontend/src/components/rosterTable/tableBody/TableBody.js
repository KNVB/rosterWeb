import {useEffect,useState } from 'react';
import Roster from '../../../utils/roster';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function TableBody(props){
    
    //沒有加第二個參數時，會在第一次 render和每次元件 rerender 時呼叫
    useEffect(()=>{
        const roster=new Roster(); 
        roster.get(props.rosterYear,props.rosterMonth);
    })
    return (
        <tbody>
            <tr>
                <RosterTableCell content="Body"/>
            </tr>
        </tbody>
    )
}
export default TableBody;