import { Button, Modal } from 'react-bootstrap';
import Utility from '../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedShiftDetail }) {
    if (isShowShiftDetail) {
        let body = [];
        //console.log(selectedShiftDetail);
        selectedShiftDetail.shiftList.forEach((shift, index) => {
            if (shift.shiftType === "t") {
                body.push(
                    <tr key={"shift_" + index}>
                        <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                        <td className="border border-dark ps-1">{shift.shiftType}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_0"}>
                        <td className='border border-dark pe-1 text-end w-25'>Claim Type</td>
                        <td className="border border-dark ps-1">{shift.claimType}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_1"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">{shift.description}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_2"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shift.startTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_2"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shift.endTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_3"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{shift.duration}</td>
                    </tr>
                );
                body.push(
                    <tr key={"shift_" + index+"_4"}>
                        <td className='border border-dark pe-1 text-end w-25'>Status</td>
                        <td className="border border-dark ps-1">{shift.status}</td>
                    </tr>
                );
            } else {
                body.push(
                    <tr key={"shift_" + index}>
                        <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                        <td className="border border-dark ps-1">{(shift.shiftType) ? shift.shiftType : "Not Assigned"}</td>
                    </tr>
                );
            }
        });
        return (
            <Modal onHide={hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {selectedShiftDetail.itoName} {selectedShiftDetail.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(selectedShiftDetail.date)}</td>
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