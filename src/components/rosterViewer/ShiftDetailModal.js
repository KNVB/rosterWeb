import { Button, Modal } from 'react-bootstrap';
import Utility from '../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedShift }) {
    //console.log(selectedShift);

    if (isShowShiftDetail) {
        let body = [];
        selectedShift.shiftInfoList.forEach((shiftInfo, index) => {
            body.push(
                <tr key={"shift_" + index}>
                    <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                    <td className="border border-dark ps-1">{(shiftInfo.shiftType === "") ? "Not Assigned" : shiftInfo.shiftType}</td>
                </tr>
            );
            if (shiftInfo.shiftType === "t") {
                body.push(
                    <tr key={"shift_" + index + "_0"}>
                        <td className='border border-dark pe-1 text-end w-25'>Claim Type</td>
                        <td className="border border-dark ps-1">{shiftInfo.claimType}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_1"}>
                        <td className='border border-dark pe-1 text-end w-25'>Description</td>
                        <td className="border border-dark ps-1">{shiftInfo.description}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_2"}>
                        <td className='border border-dark pe-1 text-end w-25'>Start Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shiftInfo.startTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_3"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shiftInfo.endTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index + "_4"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{shiftInfo.duration}</td>
                    </tr>
                );
                /*
                body.push(
                    <tr key={"shift_" + index + "_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Status</td>
                        <td className="border border-dark ps-1">{shiftInfo.status}</td>
                    </tr>
                );
                */
                body.push(
                    <tr key={"shift_" + index + "_6"}>
                        <td className="border border-dark ps-1" colSpan={2}></td>
                    </tr>
                );
            }
        })
        return (
            <Modal onHide={hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {selectedShift.itoName} {selectedShift.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(selectedShift.date)}</td>
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
}