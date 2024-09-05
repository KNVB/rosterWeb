import { Button, Modal } from 'react-bootstrap';
import "./TimeOffModal.css";
export default function TimeOffModal({ hideTimeOff, isShowTimeOff, rosterViewerData, selectedITOId }) {
    const { roster, timeOffList } = rosterViewerData;
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",       
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    if (selectedITOId) {
        return (
            <Modal contentClassName='h-75' onHide={hideTimeOff} scrollable show={isShowTimeOff} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{roster[selectedITOId].itoName} ({roster[selectedITOId].itoPostName}) Time off Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <thead>
                            <tr>
                                <td>Start Time</td>
                                <td>End Time</td>
                                <td>Description</td>
                                <td>No of hour applied for</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                timeOffList[selectedITOId].records.map((record, index) => (
                                    <tr key={"timeOffEntry_" + index}>
                                        <td>{dateFormatter.format(record.timeOffStart).replaceAll(",","")}</td>
                                        <td>{dateFormatter.format(record.timeOffEnd).replaceAll(",","")}</td>
                                        <td>{record.description}</td>
                                        <td className='align-center'>{record.timeOffAmount}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot style={{ "borderTop": "1px black solid" }}>
                            <tr>
                                <td colSpan={2}>
                                </td>
                                <td className='align-right'>
                                    Total:
                                </td>
                                <td className='align-center'>
                                    {timeOffList[selectedITOId].total}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideTimeOff} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        );
    } else {
        return null
    }
}