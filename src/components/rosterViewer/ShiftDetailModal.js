import { Button, Modal } from 'react-bootstrap';
import Utility from '../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedShift }) {
    //console.log(selectedShift);
    if (isShowShiftDetail) {
        let body = [];
        let shiftList = selectedShift.shiftType.split("+");
        shiftList.forEach((shift, index) => {
            body.push(
                <tr key={"shift_" + index}>
                    <td className='border border-dark pe-1 text-end w-25'>Shift Type</td>
                    <td className="border border-dark ps-1">{shift}</td>
                </tr>
            );
            if (shift === "t") {
                selectedShift.shiftDetail.forEach((shift, detailIndex) => {
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_0"}>
                            <td className='border border-dark pe-1 text-end w-25'>Claim Type</td>
                            <td className="border border-dark ps-1">{shift.claimType}</td>
                        </tr>
                    );
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_1"}>
                            <td className='border border-dark pe-1 text-end'>Description</td>
                            <td className="border border-dark ps-1">{shift.description}</td>
                        </tr>
                    );
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_2"}>
                            <td className='border border-dark pe-1 text-end'>Start Time</td>
                            <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shift.startTime)}</td>
                        </tr>
                    );
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_3"}>
                            <td className='border border-dark pe-1 text-end'>End Time</td>
                            <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(shift.endTime)}</td>
                        </tr>
                    );
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_4"}>
                            <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                            <td className="border border-dark ps-1">{shift.duration}</td>
                        </tr>
                    );
                    body.push(
                        <tr key={"shift_" + index + "_" + detailIndex + "_5"}>
                            <td className='border border-dark pe-1 text-end w-25'>Status</td>
                            <td className="border border-dark ps-1">{shift.status}</td>
                        </tr>
                    );
                });
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
        )
    }
}