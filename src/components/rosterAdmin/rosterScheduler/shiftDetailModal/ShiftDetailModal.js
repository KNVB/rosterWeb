import { Button, Modal } from 'react-bootstrap';
import useShiftDetailModal from "./useShiftDetailModal";

import DateTimePicker from "../../../common/calendarPicker/dateTimePicker/DateTimePicker";
import Utility from '../../../../util/Utility';

export default function ShiftDetailModal({ isShowShiftDetail, shiftDetail, uiAction }) {
    let { tempShiftDetail, shiftDetailMethod } = useShiftDetailModal(shiftDetail);
    console.log(tempShiftDetail);
    //console.log(uiAction.getActiveShiftList())
    if (isShowShiftDetail) {
        return (
            <Modal onHide={uiAction.hideShiftDetail} scrollable show={isShowShiftDetail} size="lg">
                <Modal.Header closeButton>
                    {tempShiftDetail.itoName} {tempShiftDetail.itoPostName}
                </Modal.Header>
                <Modal.Body>
                    <table className='w-100'>
                        <tbody>
                            <tr>
                                <td className='border border-dark pe-1 text-end'>Date</td>
                                <td className="border border-dark ps-1">{Utility.dateFormatter.format(tempShiftDetail.date)}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={uiAction.hideShiftDetail} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>

        )
    }
}