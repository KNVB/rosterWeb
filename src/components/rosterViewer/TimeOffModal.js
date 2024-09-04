import { Button, Modal } from 'react-bootstrap';
export default function TimeOffModal({ hideTimeOff, isShowTimeOff, rosterViewerData, selectedITOId }) {
    const { roster, timeOffList } = rosterViewerData;
    let timeOffRecords=[];
    let timeOffBalance=0;
    timeOffList[selectedITOId].records.forEach(record => {
        timeOffRecords.push(
            <tr>
                <td>{record.timeOffStart}</td>
                <td>{record.timeOffEnd}</td>
                <td>{record.description}</td>
            </tr>
        ); 
    });

    return (
        <Modal contentClassName='h-75' onHide={hideTimeOff} scrollable show={isShowTimeOff} size="lg">
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
                        </tr>
                    </thead>
                    <tbody>
                        {timeOffRecords}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideTimeOff} variant="secondary">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}