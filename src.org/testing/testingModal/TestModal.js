import { useState } from 'react';
import DateTimePicker from '../calendarPicker/dateTimePicker/DateTimePicker';
import Modal from 'react-bootstrap/Modal';
import "./TestModal.css";
export default function TestModal() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date('2024-2-1'));
    const [timeValue, setTimeValue] = useState("12");
    let getSelectedValue = selectedValue => {
        console.log(selectedValue);
        setSelectedDateTime(selectedValue);
    }
    let handleClick=e=>{
        let element=e.target;
        let value=element.value;
        element.value="";
        element.value=value;
    }
    let handleChange = e => {
        let temp = e.target.value;
        let result;

        if (Number(temp) < Number(e.target.max)) {
            if ((temp === "0") || (temp === "")) {
                result = 12
            } else {
                result = Number(temp);
            }
        } else {
            temp = temp.substring(temp.length - 1);
            if (temp === "0") {
                result = 12
            } else {
                result = Number(temp);
            }
        }
        setTimeValue(String(result).padStart(2, '0'));
    }

    return (
        <Modal contentClassName='h-75' scrollable show={true} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Time off</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <div>
                    Start Time:&nbsp;<DateTimePicker getSelectedValue={getSelectedValue} value={selectedDateTime} />
                </div>
                <input
                    style={{ "outline": "none" }}
                    max="13"
                    min="0"
                    onClick={handleClick}
                    onChange={handleChange}
                    type="number"
                    value={timeValue} />
                <div
                    contentEditable={true}
                    onKeyDown={e => e.preventDefault()}
                    suppressContentEditableWarning={true}>
                </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
}