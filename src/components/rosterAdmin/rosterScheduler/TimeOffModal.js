import { Button, Modal } from 'react-bootstrap';

export default function TimeOffModal({ hideTimeOff, isShowTimeOff, selectedITOInfo, selectedTimeOff }) {
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    //console.log(selectedITOInfo);
    if (selectedTimeOff) {
        //console.log(selectedTimeOff);
        return (
            <Modal onHide={hideTimeOff} scrollable show={isShowTimeOff} size="lg">
                <Modal.Header closeButton>
                    {selectedITOInfo.itoName} {selectedITOInfo.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Start Time</td>
                                <td className="border border-dark ps-1">{dateFormatter.format(selectedTimeOff.timeOffStart)}</td>
                            </tr>
                            <tr>

                                <td className='border border-dark pe-1 text-end'>End Time</td>
                                <td className="border border-dark ps-1">{dateFormatter.format(selectedTimeOff.timeOffEnd)}</td>
                            </tr>
                            <tr>
                                <td className='border border-dark pe-1 text-end w-25'>No of hour applied for</td>
                                <td className='border border-dark ps-1 text-start'>{selectedTimeOff.timeOffAmount}</td>
                            </tr>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Description</td>
                                <td className='border border-dark ps-1'>{selectedTimeOff.description}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideTimeOff} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        );
    } else {
        return null;
    }

}