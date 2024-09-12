import { Button, Modal } from 'react-bootstrap';
import useShiftDetailModal from './useShiftDetailModal';
import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from '../../../../util/Utility';

export default function ShiftDetailModal({ hideShiftDetail, isShowShiftDetail, rosterSchedulerData, selectedITOId, selectedShiftDetailDate }) {
    let {
        selectedDate,
        selectedShiftDetail,
        shiftType,
        itoName,
        itoPostName,            
        timeSlot,
        uiAction
    } = useShiftDetailModal(rosterSchedulerData, selectedITOId, selectedShiftDetailDate);
    let resetData=e=>{
        uiAction.reset();
        hideShiftDetail();
    }
    let updateEndTime = newValue => {
        uiAction.updateEndTime(newValue);
    }
    let updateShiftDetail = e => {
        uiAction.updateShiftDetail(e.target.value);
    }
    let updateShiftType = e => { 
        uiAction.updateShiftType(e.target.value);
    }
    let updateStartTime = newValue => {
        uiAction.updateStartTime(newValue);
    }
    
    if (selectedITOId) {       
        return (
            <Modal contentClassName='h-75' onHide={resetData} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {itoName} {itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(selectedDate)}</td>
                            </tr>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Shift Type</td>
                                <td className="border border-dark ps-1">
                                    <select onChange={updateShiftType} name="shiftType" value={shiftType}>
                                        <option>Not Assigned</option>
                                        {
                                            Object.keys(rosterSchedulerData.activeShiftList).map((shift, index) => (
                                                <option key={"shiftType_" + index} value={shift}>{shift}</option>
                                            ))
                                        }
                                    </select>
                                    {(shiftType === "t") &&
                                        <span className='ps-2'>i.e. {timeSlot}</span>
                                    }
                                </td>
                            </tr>
                            {(shiftType === "t") &&
                                <>
                                    <tr>
                                        <td className='border border-dark pe-1 text-end'>Description</td>
                                        <td className="border border-dark ps-1">
                                            <textarea className='w-100' onChange={updateShiftDetail} name="description" value={selectedShiftDetail.description} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='border border-dark pe-1 text-end'>Start Time</td>
                                        <td className="border border-dark ps-1">
                                            <DateTimePicker onChange={value => updateStartTime(value)} value={selectedShiftDetail.timeOffStart} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='border border-dark pe-1 text-end'>End Time</td>
                                        <td className="border border-dark ps-1">
                                            <DateTimePicker onChange={value => updateEndTime(value)} value={selectedShiftDetail.timeOffEnd} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='border border-dark pe-1 text-end w-25'>Duration in hour</td>
                                        <td className="border border-dark ps-1">
                                            {selectedShiftDetail.timeOffAmount}
                                        </td>
                                    </tr>
                                </>
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">Update</Button>
                    <Button onClick={resetData} variant="secondary">Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}