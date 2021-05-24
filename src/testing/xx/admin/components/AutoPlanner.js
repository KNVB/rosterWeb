import './AutoPlanner.css';
import {Fragment} from "react";
export default function AutoPlanner(props){
    return (
        <Fragment>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Auto Planning Start From:
                        </td>
                        <td colSpan="2">
                            <select id="autoPlanStartDate">
                            </select>
                            &nbsp;to&nbsp;
                            <select id="autoPlanEndDate"></select>
                        </td>
                    </tr>
                    <tr>
                        <td>Iteration Count:</td>
                        <td><input id="iterationCount" type="number"/></td>
                        <td>&nbsp;<div className="autoPlannerButton">Auto Planner</div></td>
                    </tr>
                </tbody>
            </table>
            <div id="genResult" style={{"padding-left": "10px"}}>
                <table>
                    <tbody>
                        <tr>
                            <td colSpan="2">Standard Deviation:</td>
                        </tr>
                        <tr id="theLowestSD">
                            <td>1</td><td>1</td>
                        </tr>
                        <tr id="secondLowestSD">
                            <td>1</td><td>1</td>
                        </tr>
                        <tr id="thirdLowestSD">
                            <td>1</td><td></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><br/></td>
                        </tr>
                        <tr>
                            <td colSpan="2">Missing shift Count:</td>
                        </tr>
                        <tr id="theLowestMissingShiftCount">
                            <td>1</td><td>1</td>
                        </tr>
                        <tr id="theSecondLowestMissingShiftCount">
                            <td>1</td><td>1</td>
                        </tr>
                        <tr id="theThirdLowestMissingShiftCount">
                            <td>1</td><td>1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}