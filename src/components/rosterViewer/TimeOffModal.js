import { Button, Modal } from 'react-bootstrap';
export default function TimeOffModal({ hideTimeOff, isShowTimeOff, rosterViewerData, selectedITOId }) {
    const { roster, timeOffList } = rosterViewerData;
    let timeOffRecords = [];
    let timeOffBalance = 0;
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    if (selectedITOId) {
        timeOffList[selectedITOId].records.forEach((record,index) => {
            timeOffRecords.push(
                <tr key={"timeOffEntry_"+index}>
                    <td>{dateFormatter.format(record.timeOffStart)}</td>
                    <td>{dateFormatter.format(record.timeOffEnd)}</td>
                    <td>{record.description}</td>
                    <td>{record.timeOffAmount}</td>
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
                                <td>No of hour applied for</td>
                            </tr>
                        </thead>
                        <tbody>
                            {timeOffRecords}
                        </tbody>
                        <tfoot style={{"borderTop":"1px black solid"}}>
                            <tr>
                                <td colSpan={2}>
                                </td>
                                <td style={{"textAlign":"right"}}>
                                    Total:
                                </td>
                                <td>      
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