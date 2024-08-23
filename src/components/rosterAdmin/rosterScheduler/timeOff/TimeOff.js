import { useState } from 'react';
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-date-picker';
import Modal from 'react-bootstrap/Modal';


export default function TimeOff({ itoId, uiAction }) {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    return (
        <div className='d-flex align-items-center'>
            <span className='me-2'>Time off in hour:{uiAction.getTotalTimeOff(itoId)}</span>
            <Pencil onClick={handleShow} title='Edit Time off' variant="primary"/>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Time off</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DatePicker/> <PlusLg />
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