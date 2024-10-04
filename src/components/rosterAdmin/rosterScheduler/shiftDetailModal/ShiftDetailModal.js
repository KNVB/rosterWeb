import { Button, Modal } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import useShiftDetailModal from "./useShiftDetailModal";
import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from "../../../../util/Utility";
export default function ShiftDetailModal({ activeShiftList, hideShiftDetail, isShowShiftDetail, incomingShiftObj }) {
    const {
        date,
        itoName,
        itoPostName,
        shiftDetailList,
        action
    } = useShiftDetailModal(incomingShiftObj);
    let body = [];
    
    shiftDetailList.forEach((obj, index) => {
        body.push(
            <tr key={"shift_" + index}>
                <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                <td className="border border-dark ps-1 m-0">
                    <select className="text-start" onChange={e => action.updateShiftType(index, e.target.value)} value={obj.shiftType}>
                        <option value="">Not Assigned</option>
                        {
                            Object.keys(activeShiftList).map((shift, index) => (
                                <option key={"shiftType_" + index} value={shift}>{shift}</option>
                            ))
                        }
                    </select>
                </td>
            </tr>
        );
        if (obj.shiftType === "t") {
            obj.shiftDetailList.forEach((detail, detailIndex) => {
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_0"}>
                        <td className='border border-dark pe-1 text-end'>Claim Type</td>
                        <td className="border border-dark ps-1">
                            <select onChange={e => action.updateClaimType(index, detailIndex, e.target.value)} name="claimType" value={detail.claimType}>
                                <option value="">Not Assigned</option>
                                <option value="timeOff">Time Off</option>
                                <option value="overTime">Over Time</option>
                                <option value="training">Training</option>
                            </select>
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_1"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">
                            <textarea className='w-100' onChange={e => action.updatDesc(index, detailIndex, e.target.value)} name="description" value={detail.description} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_2"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => action.updateStartTime(index, detailIndex, value)} value={detail.startTime} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_3"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => action.updateEndTime(index, detailIndex, value)} value={detail.endTime} />
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_4"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{detail.duration}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_" + detailIndex + "_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Status</td>
                        <td className="border border-dark ps-1">{detail.status}</td>
                    </tr>
                );
            });
        }
        body.push(
            <tr key={"shift_" + index + "_end"}>
                <td className="border border-dark ps-1 m-0" colSpan={2}></td>
            </tr>
        );
    });
    return (
        <Modal onHide={hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
            <Modal.Header closeButton>
                {itoName} {itoPostName}
            </Modal.Header>
            <Modal.Body>
                <table className='w-100'>
                    <tbody>
                        <tr>
                            <td className='border border-dark pe-1 text-end'>Date</td>
                            <td className="border border-dark ps-1">{Utility.dateFormatter.format(date)}</td>
                        </tr>
                        {body}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideShiftDetail} variant="secondary">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}