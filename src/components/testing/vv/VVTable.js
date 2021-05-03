import {useEffect,useReducer} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
//import VVBody from './VVBody';
import useUndoUtil from './useUndoUtil';
import './VVTable.css';
import useRosterMonth from './useRosterMonth';

export default function VVTable(props){
    let contextValue=useRosterMonth(props.rosterMonth);
    return(
        <table id="rosterTable">
        </table>    
    )
}