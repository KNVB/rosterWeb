import { useState } from 'react';
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DateTimePicker from '../../../common/dateTimePicker/DateTimePicker';


export default function TimeOff({ itoId, timeOffList, uiAction }) {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    return (
        <div className='d-flex align-items-center'>
            <span className='me-2'>Time off in hour:{uiAction.getTotalTimeOff(itoId)}</span>
            <Pencil onClick={handleShow} title='Edit Time off' variant="primary" />
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Time off</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='align-items-center d-flex flex-row'>
                        start time:&nbsp;<DateTimePicker />&nbsp;
                        end time:&nbsp;<DateTimePicker />&nbsp;
                        <button className="btn btn-primary ms-2" value="-">-</button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}