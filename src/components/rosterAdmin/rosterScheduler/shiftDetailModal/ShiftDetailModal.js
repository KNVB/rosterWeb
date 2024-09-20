import { Button, Modal } from 'react-bootstrap';
import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from '../../../../util/Utility';
export default function ShiftDetailModal(
    {
        activeShiftList, isShowShiftDetail,
        shiftDetail, uiAction
    }) {
    //console.log(shiftDetail);

    let updateEndTime = newValue => {
        if (newValue > shiftDetail.timeOffStart) {
            uiAction.updateShiftDetailEndTime(newValue);
        } else {
            alert("The end time must later than the start time.");
        }
    }
    let updateShiftDetail = e => {
        if (shiftDetail.timeOffStart >= shiftDetail.timeOffEnd) {
            alert("The start time must earlier than the end time.");
            return
        }
        if ((shiftDetail.shiftType === undefined) || (shiftDetail.shiftType === "")) {
            alert("Please enter the shift type.");
            return
        }
        if (shiftDetail.description === "") {
            alert("Please enter the description.");
            return
        }
        uiAction.updateShiftDetail();
    }
    let updateShiftDetailDesc = e => {
        if (e.target.value.trim() === "") {
            alert("Please enter the description.");
        } else {
            uiAction.updateShiftDetailDesc(e.target.value);
        }
    }
    let updateShiftType = e => {
        if (e.target.value.trim() === "") {
            alert("Please enter the shift type.");
        } else {
            uiAction.updateShiftDetailShiftType(e.target.value);
        }
    }
    let updateStartTime = newValue => {
        if (newValue < shiftDetail.timeOffEnd) {
            uiAction.updateShiftDetailStartTime(newValue);
        } else {
            alert("The start time must earlier than the end time.");
        }

    }
    return (
        isShowShiftDetail &&
        <Modal
            contentClassName='h-75'
            onHide={uiAction.hideShiftDetail}
            scrollable show={isShowShiftDetail} size="lg">
            <Modal.Header closeButton>
                {shiftDetail.itoName} {shiftDetail.itoPostName}
            </Modal.Header>
            <Modal.Body>
                <table className='w-100'>
                    <tbody>
                        <tr>
                            <td className='border border-dark pe-1 text-end'>Date</td>
                            <td className="border border-dark ps-1">{Utility.dateFormatter.format(shiftDetail.shiftDetailDate)}</td>
                        </tr>
                        <tr>
                            <td className='border border-dark pe-1 text-end'>Shift Type</td>
                            <td className="border border-dark ps-1">
                                <select onChange={updateShiftType} name="shiftType" value={shiftDetail.shiftType}>
                                    <option value="">Not Assigned</option>
                                    {
                                        Object.keys(activeShiftList).map((shift, index) => (
                                            <option key={"shiftType_" + index} value={shift}>{shift}</option>
                                        ))
                                    }
                                </select>
                                {
                                    (shiftDetail.shiftType === "t") &&
                                    <span className='ps-2'>i.e. {activeShiftList["t"].timeSlot}</span>
                                }
                            </td>
                        </tr>
                        {(shiftDetail.shiftType === "t") &&
                            <>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>Description</td>
                                    <td className="border border-dark ps-1">
                                        <textarea className='w-100' onChange={updateShiftDetailDesc} name="description" value={shiftDetail.description} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>Start Time</td>
                                    <td className="border border-dark ps-1">
                                        <DateTimePicker getSelectedValue={value => updateStartTime(value)} value={shiftDetail.timeOffStart} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>End Time</td>
                                    <td className="border border-dark ps-1">
                                        <DateTimePicker getSelectedValue={value => updateEndTime(value)} value={shiftDetail.timeOffEnd} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                                    <td className="border border-dark ps-1">
                                        {shiftDetail.timeOffAmount}
                                    </td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={updateShiftDetail}
                    variant="secondary">
                    Update
                </Button>
                <Button
                    onClick={uiAction.hideShiftDetail}
                    variant="secondary">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}