import { Button, Modal } from 'react-bootstrap';
import Utility from '../../../util/Utility';
export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, selectedShift }){
    if (isShowShiftDetail) {
        let body = [];
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