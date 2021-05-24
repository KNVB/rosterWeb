import './AutoPlanner.css';
import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
export default function AutoPlanner(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        Auto Planning Start From:
                    </td>
                    <td colSpan="3">
                        <select id="autoPlanStartDate">
                        </select>
                        &nbsp;to&nbsp;
                        <select id="autoPlanEndDate"></select>
                    </td>
                </tr>
                <tr>
                    <td>Iteration Count:</td>
                    <td><input id="iterationCount" type="number"/></td>
                    <td colSpan="2">&nbsp;<div className="autoPlannerButton">Auto Planner</div></td>
                </tr>
                <tr>
                    <td colSpan="2">Standard Deviation:</td>
                    <td colSpan="2">Missing shift Count:</td>
                </tr>
                <tr id="theLowestSD">
                    <td>1</td><td>1</td>
                    <td>1</td><td>1</td>
                </tr>
                <tr id="thirdLowestSD">
                    <td>1</td><td></td>
                    <td colSpan="2"><br/></td>
                </tr>
                <tr id="theLowestMissingShiftCount">
                    <td>1</td><td>1</td>
                    <td>1</td><td>1</td>
                </tr>
            </tbody>
        </table>
    );
}