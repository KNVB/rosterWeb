import { Button, Modal } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import useShiftDetailModal from "./useShiftDetailModal";
import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from "../../../../util/Utility";

export default function ShiftDetailModal({ activeShiftList, hideShiftDetail, isShowShiftDetail, incomingShiftObj, updateShiftFromModal }) {
    const {
        date,
        errorList,
        itoId,
        itoName,
        itoPostName,
        shiftInfoList,
        action
    } = useShiftDetailModal(incomingShiftObj);
    let updateSelectedShift = () => {
        if (action.isShiftDetailValid()){
            updateShiftFromModal({
                date,
                itoId,
                itoName,
                itoPostName,
                shiftInfoList   
            });
        }
    }
    if (isShowShiftDetail) {
        //console.log(incomingShiftObj);
        let body = [];
        shiftInfoList.forEach((shiftInfo, index) => {
            body.push(
                <tr key={"shift_" + index}>
                    <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                    <td className="border border-dark ps-1">
                        <select onChange={e => action.updateShiftType(index,e.target.value)} value={shiftInfo.shiftType}>
                            <option value="">Not Assigned</option>
                            {
                                Object.keys(activeShiftList).map((shift, shiftIndex) => (
                                    <option key={"shiftType_" + shiftIndex} value={shift}>{shift}</option>
                                ))
                            }
                        </select>
                        <span className='ms-1 text-danger'>{errorList[index + "_shiftType"]}</span>
                    </td>
                </tr>
            );
            if (shiftInfo.shiftType === "t") {
                body.push(
                    <tr key={"shift_" + index + "_0"}>
                        <td className='border border-dark pe-1 text-end'>Claim Type</td>
                        <td className="border border-dark ps-1">
                            <select onChange={e => action.updateClaimType(index, e.target.value)} name="claimType" value={shiftInfo.claimType}>
                                <option value="">Not Assigned</option>
                                <option value="timeOff">Time Off</option>
                                <option value="overTime">Over Time</option>
                                <option value="training">Training</option>
                            </select>
                            <span className='ms-1 text-danger'>{errorList[index + "_claimType"]}</span>
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_1"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">
                            <textarea
                                className='w-100'
                                onBlur={e => action.updatDesc(index, e.target.value)}
                                onChange={e => action.updatDesc(index, e.target.value)}
                                name="description"
                                value={shiftInfo.description} />
                            {
                                (errorList[index + "_desc"]) ? <div className='text-danger'>{errorList[index + "_desc"]}</div> : ""
                            }
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_2"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => action.updateStartTime(index, value)} value={shiftInfo.startTime} />
                            <span className='ms-1 text-danger'>{errorList[index + "_startTime"]}</span>
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_3"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">
                            <DateTimePicker onChange={value => action.updateEndTime(index, value)} value={shiftInfo.endTime} />
                            <span className='ms-1 text-danger'>{errorList[index + "_endTime"]}</span>
                        </td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index +"_4"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{shiftInfo.duration}</td>
                    </tr>
                );
                /*
                body.push(
                    <tr key={"shift_" + index + "_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Status</td>
                        <td className="border border-dark ps-1">{detail.status}</td>
                    </tr>
                );*/
            } else {
                body.push(
                    <tr key={"shift_" + index + "_6"}>
                        <td className="border border-dark ps-1" colSpan={2}></td>
                    </tr>
                );
            }
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
                    <Button onClick={updateSelectedShift} variant="secondary">Update</Button>
                    <Button onClick={hideShiftDetail} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}