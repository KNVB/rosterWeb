import { useState } from 'react';
import DateTimePicker from '../calendarPicker/dateTimePicker/DateTimePicker';
import Modal from 'react-bootstrap/Modal';
import "./TestModal.css";
export default function TestModal() {
    const[selectedDateTime,setSelectedDateTime]=useState(new Date('2024-2-1'));
    let getSelectedValue=selectedValue=>{
        console.log(selectedValue);
        setSelectedDateTime(selectedValue);
    }
    return (
        <Modal contentClassName='h-75' scrollable show={true} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Time off</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <div>
                    Start Time:&nbsp;<DateTimePicker getSelectedValue={getSelectedValue} value={selectedDateTime}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                
            </Modal.Footer>
        </Modal>
    )
}