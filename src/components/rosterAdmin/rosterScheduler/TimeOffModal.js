import { Button, Modal } from 'react-bootstrap';

export default function TimeOffModal({ date, hideTimeOff, isShowTimeOff, rosterSchedulerData, selectedITOId }) {
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    let roster=rosterSchedulerData.roster[selectedITOId];
    let timeOff=rosterSchedulerData.timeOffList[selectedITOId].records[date];
    console.log(roster.shiftList[date]);
    return (
        <Modal onHide={hideTimeOff} scrollable show={isShowTimeOff} size="lg">
            <Modal.Header closeButton>
                {roster.itoName} {roster.itoPostName}
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={hideTimeOff} variant="secondary">Close</Button>
            </Modal.Footer>
        </Modal>
    );
}