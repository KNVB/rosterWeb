import { Button, Modal } from 'react-bootstrap';
import Utility from '../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedShiftDetail }) {
    let body = [];
    if (isShowShiftDetail) {
        switch (selectedShiftDetail.shiftType) {
            case undefined:
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">Not Assigned</td>
                    </tr>
                );
                break;
            case "t":
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">{selectedShiftDetail.shiftType}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_6"}>
                        <td className='border border-dark pe-1 text-end w-25'>Claim Type</td>
                        <td className="border border-dark ps-1">{selectedShiftDetail.claimType}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_2"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">{selectedShiftDetail.description}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_3"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(selectedShiftDetail.startTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_4"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(selectedShiftDetail.endTime)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                        <td className="border border-dark ps-1">{selectedShiftDetail.duration}</td>
                    </tr>
                );
               
                break;
            default:
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">{selectedShiftDetail.shiftType}</td>
                    </tr>
                );
                break;
        }
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