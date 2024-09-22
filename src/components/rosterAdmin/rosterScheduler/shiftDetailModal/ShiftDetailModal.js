import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import useShiftDetailModal from "./useShiftDetailModal";

import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from '../../../../util/Utility';

export default function ShiftDetailModal({ isShowShiftDetail, selectedShiftDetail, uiAction }) {
    let {
        claimType,
        date,
        description,
        duration,
        endTime,
        itoId,
        itoName,
        itoPostName,
        shiftDetailId,
        shiftType,
        status,
        startTime,
        shiftDetailMethod
    } = useShiftDetailModal(selectedShiftDetail);
    let activeShiftList = uiAction.getActiveShiftList();
    let updateClaimType = e => {
        shiftDetailMethod.updateClaimType(e.target.value);
    }
    let updatDesc = e => {
        shiftDetailMethod.updatDesc(e.target.value);
    }
    let updateEndTime = value => {
        if (value > startTime) {
            shiftDetailMethod.updateEndTime(value);
        } else {
            alert("The end time must later than the start time.");
        }
    }
    let updateShiftType = e => {
        shiftDetailMethod.updateShiftType(e.target.value);
    }
    let updateStartTime = value => {
        if (value < endTime) {
            shiftDetailMethod.updateStartTime(value);
        } else {
            alert("The start time must earlier than the end time.");
        }
    }
    return (
        <Modal contentClassName='h-75' onHide={uiAction.hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
            <Modal.Header closeButton>
                {itoName} {itoPostName}
            </Modal.Header>
            <Modal.Body>
                <table className='m-0 w-100'>
                    <tbody>
                        <tr>
                            <td className='border border-dark pe-1 text-end'>Date</td>
                            <td className="border border-dark ps-1">{Utility.dateFormatter.format(date)}</td>
                        </tr>
                        <tr>
                            <td className='border border-dark pe-1 text-end'>Shift Type</td>
                            <td className="border border-dark ps-1">
                                <select onChange={updateShiftType} name="shiftType" value={shiftType}>
                                    <option value="">Not Assigned</option>
                                    {
                                        Object.keys(activeShiftList).map((shift, index) => (
                                            <option key={"shiftType_" + index} value={shift}>{shift}</option>
                                        ))
                                    }
                                </select>
                                {
                                    (shiftType === "t") &&
                                    <span className='ps-2'>i.e. {activeShiftList["t"].timeSlot}</span>
                                }
                            </td>
                        </tr>
                        {
                            (shiftType === "t") &&
                            <>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>Claim Type</td>
                                    <td className="border border-dark ps-1">
                                        <select onChange={updateClaimType} name="claimType" value={claimType}>
                                            <option value="">Not Assigned</option>
                                            <option value="timeOff">Time Off</option>
                                            <option value="overTime">Over Time</option>
                                            <option value="training">Training</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>Description</td>
                                    <td className="border border-dark ps-1">
                                        <textarea className='w-100' onChange={updatDesc} name="description" value={description} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>Start Time</td>
                                    <td className="border border-dark ps-1">
                                        <DateTimePicker onChange={value => updateStartTime(value)} value={startTime} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end'>End Time</td>
                                    <td className="border border-dark ps-1">
                                        <DateTimePicker onChange={value => updateEndTime(value)} value={endTime} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                                    <td className="border border-dark ps-1">
                                        {duration}
                                    </td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button>Update</Button>
                <Button onClick={uiAction.hideShiftDetail} variant="secondary">Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}