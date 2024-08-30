import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import DateTimePicker from '../calendarPicker/dateTimePicker/DateTimePicker';
//import DateTimePicker from '../../common/dateTimePicker/DateTimePicker';
import Modal from 'react-bootstrap/Modal';
import "./TestModal.css";
export default function TestModal() {
    const [scroll, setScroll] = useState(false);
    return (
        <Modal contentClassName='h-75' scrollable show={true} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Time off</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <div>
                    Start Time:&nbsp;<DateTimePicker value={new Date('2024-2-1')}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                
            </Modal.Footer>
        </Modal>
    )
}