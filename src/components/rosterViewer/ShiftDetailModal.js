import { Button, Modal } from 'react-bootstrap';
import Utility from '../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedITOId, selectedShiftDetailDate, rosterViewerData }) {

    if (selectedITOId) {
        let body = [];
        let roster = rosterViewerData.roster[selectedITOId];
        let shiftType = roster.shiftList[selectedShiftDetailDate];
        let temp = new Date(rosterViewerData.rosterMonth.getTime());
        temp.setDate(selectedShiftDetailDate);
    
        switch (shiftType) {
            case undefined:
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">Not Assigned</td>
                    </tr>
                );
                break;
            case "t":
                let selectedTimeOff = rosterViewerData.timeOffList[selectedITOId].records[selectedShiftDetailDate];
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">{rosterViewerData.activeShiftList[shiftType].timeSlot}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_2"}>
                        <td className='border border-dark pe-1 text-end'>Description</td>
                        <td className="border border-dark ps-1">{selectedTimeOff.description}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_3"}>
                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(selectedTimeOff.timeOffStart)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_4"}>
                        <td className='border border-dark pe-1 text-end'>End Time</td>
                        <td className="border border-dark ps-1">{Utility.dateTimeFormatter.format(selectedTimeOff.timeOffEnd)}</td>
                    </tr>
                );
                body.push(
                    <tr key={"detail_row_5"}>
                        <td className='border border-dark pe-1 text-end w-25'>Amount in hour</td>
                        <td className="border border-dark ps-1">{selectedTimeOff.timeOffAmount}</td>
                    </tr>
                );
                break;
            default:
                body.push(
                    <tr key={"detail_row_1"}>
                        <td className='border border-dark pe-1 text-end'>Shift Type</td>
                        <td className="border border-dark ps-1">{shiftType}</td>
                    </tr>
                );
                break;
        }
        return (
            <Modal onHide={hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {roster.itoName} {roster.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(temp)}</td>
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