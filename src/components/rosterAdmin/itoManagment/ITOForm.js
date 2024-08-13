import { Button } from "react-bootstrap";
import { useITOForm } from "../../../hooks/useITOForm";
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import handleAPIError from "../../common/handleAPIError";
import DatePicker from "react-date-picker";
import Loading from "../../common/Loading";

export default function ITOForm({ itoAction }) {
    const { activeShiftList, addShiftPattern,
        backToITOlList, doUpdate,
        error, isLoading,
        ito, removeShiftPattern,
        updateAvailableShift, updateDate, updateDutyPattern,
        updateTextField, updateShiftPattern } = useITOForm();
    let blackListedShiftPattern = "(a|(b[1]?)|c|d[123]?)(,(a|(b[1]?)|c|d[123]?))*";

    if (error) {
        return handleAPIError(error);
    }
    if (isLoading) {
        return <Loading />
    }
    let submitUpdate=e=>{
        let form = e.target.form;
        e.preventDefault();
        doUpdate(form,itoAction);
    }
    return (
        <div className="d-flex flex-grow-1 justify-content-center">
            <form onSubmit={() => { return false }}>
                <table className="border m-1 p-0">
                    <thead>
                        <tr>
                            <th className="border border-dark text-center" colSpan={4}>{(itoAction === "edit") ? "Edit" : "Add"} ITO Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-dark">ITO Name</td>
                            <td className="border border-dark">
                                <input name="name" onChange={updateTextField} required type="text" value={ito.name} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Post Name</td>
                            <td className="border border-dark">
                                <input name="post" onChange={updateTextField} pattern="ITO\d{1,2}" required type="text" value={ito.post} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Duty Pattern</td>
                            <td className="border border-dark">
                                <input checked={(ito.dutyPattern === "day")} name="dutyPattern" onChange={updateDutyPattern} required type="radio" value="day" />Monday to Friday<br />
                                <input checked={(ito.dutyPattern === "operator")} name="dutyPattern" onChange={updateDutyPattern} required type="radio" value="operator" />Regular Shift (operator)
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Available Shift</td>
                            <td className="border border-dark">
                                <div className="d-flex justify-content-between gap-1">
                                    {
                                        Object.keys(activeShiftList).map(shiftType => (
                                            <label key={shiftType}>
                                                {shiftType}
                                                <input
                                                    checked={ito.availableShift.includes(shiftType)}
                                                    name="availableShift"
                                                    onChange={updateAvailableShift}
                                                    type="checkbox"
                                                    value={shiftType} />
                                            </label>
                                        ))
                                    }
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Black Listed Shift Type</td>
                            <td className="border border-dark">
                                <div className="d-flex flex-row flex-grow-1">
                                    <div className="border border-dark d-flex flex-column flex-grow-1">
                                        {
                                            ito.blackListedShiftPattern.map((pattern, index) => (
                                                <div className="align-items-center d-flex flex-grow-1" key={"blackListedShiftPattern_" + index}>
                                                    <input
                                                        name={"blackListedShiftPattern_" + index}
                                                        onChange={updateShiftPattern}
                                                        pattern={blackListedShiftPattern}
                                                        required
                                                        type="text"
                                                        value={pattern} />&nbsp;
                                                    <DashCircleFill className="cursor-pointer" onClick={e => removeShiftPattern(index)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="align-items-center border border-dark d-flex flex-grow-1 justify-content-center">
                                        <PlusCircleFill className="cursor-pointer" onClick={addShiftPattern} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">No. of Working Hour Per Day</td>
                            <td className="border border-dark">
                                <input onChange={updateTextField} name="workingHourPerDay" pattern="\d+.?\d*" required type="text" value={ito.workingHourPerDay} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Join Date</td>
                            <td className="border border-dark">
                                <DatePicker
                                    locale="en-ca"
                                    onChange={joinDate => updateDate("joinDate", joinDate)}
                                    required={true}
                                    value={ito.joinDate} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Leave Date</td>
                            <td className="border border-dark">
                                <DatePicker
                                    locale="en-ca"
                                    onChange={leaveDate => updateDate("leaveDate", leaveDate)}
                                    required={true}
                                    value={ito.leaveDate} />
                                &nbsp;*2099-12-31" mean active member
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border border-dark text-center" colSpan={4}>
                                <Button onClick={backToITOlList}>Cancel</Button>&nbsp;
                                <Button onClick={submitUpdate}>{(itoAction === "edit") ? "Update" : "Add"} ITO Info </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    );
}