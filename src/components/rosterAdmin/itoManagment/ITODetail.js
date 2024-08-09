import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
export default function ITODetail({ activeShiftList, ito, itoAction, updateAction }) {
    let navigate = useNavigate();
    let backToITOlList = e => {
        navigate("../itoManagement/list")
    }
    let doUpdate =async e => {
        let form = e.target.form;
        e.preventDefault();
        form.reportValidity();
    }
    let updateTextField = (e) => {
        let field = e.target
        updateAction.updateTextField(field.name, field.value);
    }
    return (
        <div className="d-flex flex-grow-1 justify-content-center">
            <form onSubmit={() => { return false }}>
                <table className="border m-1 p-0">
                    <thead>
                        <tr>
                            <th className="border border-dark text-center" colSpan={4}>{(itoAction === "edit") ? "Edit" : "Add"} ITO Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-dark">ITO Name</td>
                            <td className="border border-dark">
                                <input name="name" onChange={updateTextField} required type="text" value={ito.name} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Post Name</td>
                            <td className="border border-dark">
                                <input name="post" onChange={updateTextField} pattern="ITO\d{1,2}" required type="text" value={ito.post} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Duty Pattern</td>
                            <td className="border border-dark">
                                <input name="dutyPattern" required type="radio" value="day"/>Monday to Friday<br/>
                                <input name="dutyPattern" required type="radio" value="operator"/>Regular Shift (operator)
                            </td>
                        </tr>    
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border border-dark text-center" colSpan={4}>
                                <Button onClick={backToITOlList}>Cancel</Button>&nbsp;
                                <Button onClick={doUpdate}>{(itoAction === "edit") ? "Update" : "Add"} ITO Info </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    );
}