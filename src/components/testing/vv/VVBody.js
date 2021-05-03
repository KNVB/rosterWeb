import {useContext,useEffect,useReducer} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';

export default function VVBody(props){
    console.log(useContext(RosterWebContext));
    return(
        <tbody></tbody>
    )
}