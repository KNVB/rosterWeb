import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./TestModal.css";
export default function TestModal() {
    const [scroll, setScroll] = useState(false);
    return (
        <Modal contentClassName='h-500' scrollable={scroll} show={true} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Time off</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <div>
                    Start Time:
                    <div className='position-relative d-inline-block'>
                        <div className="border border-black">sdfsdfs</div>
                        <div className='datepicker bg-white border border-black'>
                            date picker
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setScroll(!scroll)}>
                    Scroll
                </Button>

            </Modal.Footer>
        </Modal>
    )
}