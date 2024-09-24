import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import useShiftDetailModal from "./useShiftDetailModal";
import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from '../../../../util/Utility';
export default function ShiftDetailModal({ isShowShiftDetail, selectedShiftDetail, uiAction }) {
    const { tempShiftDetail, action } = useShiftDetailModal(selectedShiftDetail);
    useEffect(() => {
        action.update(selectedShiftDetail);
    }, [selectedShiftDetail]);
    let updateClaimType = (index, claimType) => {
        action.updateClaimType(index, claimType);
    }
    let updateEndTime = (index, value) => {
        if (value > tempShiftDetail.shiftList[index].startTime) {
            action.updateEndTime(index, value);
        } else {
            alert("The end time must be later than end time.");
        }
    }
    let updatDesc = (index, desc) => {
        action.updatDesc(index, desc);
    }
    let updateShiftType = (index, shiftType) => {
        action.updateShiftType(index, shiftType);
    }
    let updateStartTime = (index, value) => {
        if (value < tempShiftDetail.shiftList[index].endTime) {
            action.updateStartTime(index, value);
        } else {
            alert("The start time must be earlier than end time.");
        }
    }
    if (tempShiftDetail) {
        let activeShiftList = uiAction.getActiveShiftList();
        let body = [];
        tempShiftDetail.shiftList.forEach((shift, index) => {
            body.push(
                <tr key={"shift_" + index}>
                    <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                    <td className="border border-dark ps-1">
                        <select onChange={e => updateShiftType(index, e.target.value)} name="shiftType" value={shift.shiftType}>
                            <option value="">Not Assigned</option>
                            {
                                Object.keys(activeShiftList).map((shift, index) => (
                                    <option key={"shiftType_" + index} value={shift}>{shift}</option>
                                ))
                            }
                        </select>
                        {
                            (shift.shiftType === "t") &&
                            <span className='ps-2'>i.e. {activeShiftList["t"].timeSlot}</span>
                        }
                    </td>
                </tr>
            );
            if (shift.shiftType === "t") {
                body.push(
                    <tr key={"shift_" + index + "_0"}>
                        <td className='border border-dark pe-1 text-end'>Claim Type</td>
                        <td className="border border-dark ps-1">
                            <select onChange={e => updateClaimType(index, e.target.value)} name="claimType" value={shift.claimType}>
                                <option value="">Not Assigned</option>
                                <option value="timeOff">Time Off</option>
                                <option value="overTime">Over Time</option>
                                <option value="training">Training</option>
                            </select>
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_1"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">
                            <textarea className='w-100' onChange={e => updatDesc(index, e.target.value)} name="description" value={shift.description} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_2"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => updateStartTime(index, value)} value={shift.startTime} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_3"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => updateEndTime(index, value)} value={shift.endTime} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_4"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{shift.duration}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Status</td>
                        <td className="border border-dark ps-1">{shift.status}</td>
                    </tr>
                );
            }
        });
        return (
            <Modal contentClassName='h-75' onHide={uiAction.hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {tempShiftDetail.itoName} {tempShiftDetail.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(tempShiftDetail.date)}</td>
                            </tr>
                            {body}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Add</Button>
                    <Button>Update</Button>
                    <Button onClick={uiAction.hideShiftDetail}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}