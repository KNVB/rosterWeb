import { useITOForm } from "../../../hooks/useITOForm";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import handleAPIError from "../../common/handleAPIError";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
export default function ITOForm({ itoAction }) {
   const { activeShiftList, error, isLoading, ito, updateAction } = useITOForm();
   let navigate = useNavigate();
   let backToITOlList = e => {
      navigate("../itoManagement/list")
   }
   let missingAvailableShift=shiftType=>{
      console.log(shiftType,!ito.availableShift.includes(shiftType));
      if (!ito.availableShift.includes(shiftType)){
         alert("Missing "+shiftType+" shift in available shift.");
         return true
      }
      return false
   }
   let doUpdate =async e => {
      let form = e.target.form;
      e.preventDefault();
      if (form.reportValidity()) {
         //console.log(form.availableShift);
         if (missingAvailableShift("a")||missingAvailableShift("c")||missingAvailableShift("O")){
            return
         }
         if (!ito.availableShift.includes("b") && !ito.availableShift.includes("b1")){
            alert("Missing bx shift in available shift.");
            return
         }
         if (!ito.availableShift.includes("d") && !ito.availableShift.includes("d1")  && !ito.availableShift.includes("d2")  && !ito.availableShift.includes("d3")){
            alert("Missing dx shift in available shift.");
            return
         }
         switch (itoAction){
            case "add":
               await updateAction.addITO();
               alert("New ITO added");
               backToITOlList();
               break;
            case "edit":
               await updateAction.updateITO();
               alert("The ITO info. has been saved.");
               backToITOlList();
               break;
            default:
               break;   
         }
      }
   }
   let removeShiftPattern = index => {
      updateAction.removeShiftPattern(index);
   }
   let updateAvailableShift = e => {
      let field = e.target;
      if (field.checked) {
         updateAction.updateAvailableShift("add", field.value);
      } else {
         updateAction.updateAvailableShift("remove", field.value);
      }
   }
   
   let updateShiftPattern = e => {
      let field = e.target;
      let index = Number(field.name.replace("blackListedShiftPattern_", ""));
      updateAction.updateShiftPattern(index, field.value);
   }
   let updateTextField = (e) => {
      let field = e.target
      updateAction.updateTextField(field.name, field.value);
   }
   if (error) {
      return handleAPIError(error);
   }
   if (isLoading) {
      return <div className="modalBackground"><img src="/icon.gif" /></div>
   } else {
      let activeShiftRow = [], blackListedShiftPattern = "(";
      Object.keys(activeShiftList).forEach(shiftType => {
         if ((shiftType !== "essentialShift") && (shiftType !== "s")) {
            blackListedShiftPattern += shiftType + ")(";
            activeShiftRow.push(
               <label key={shiftType}>
                  {shiftType}&nbsp;
                  <input
                     checked={ito.availableShift.includes(shiftType)}
                     name="availableShift"
                     onChange={updateAvailableShift}
                     type="checkbox"
                     value={shiftType}/>
               </label>
            );
         }
      });
      blackListedShiftPattern = blackListedShiftPattern.substring(0, blackListedShiftPattern.length - 1);
      blackListedShiftPattern = "[" + blackListedShiftPattern + "]{1}(,[" + blackListedShiftPattern + "])*";
      //console.log(blackListedShiftPattern);
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
                           <input name="post" onChange={updateTextField} pattern="ITO\d{1}" required type="text" value={ito.post} />
                        </td>
                     </tr>
                     <tr>
                        <td className="border border-dark">Available Shift</td>
                        <td className="border border-dark">
                           <div className="d-flex justify-content-around">
                              {activeShiftRow}
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td className="border border-dark">Black Listed Shift Type</td>
                        <td className="border border-dark">
                           <div className="d-flex flex-row flex-grow-1">
                              <div className="border border-dark d-flex flex-column flex-grow-1">
                                 {
                                    ito.blackListedShiftPattern.map((pattern, index) => (
                                       <div className="align-items-center d-flex flex-grow-1" key={"blackListedShiftPattern_" + index}>
                                          <input
                                             name={"blackListedShiftPattern_" + index}
                                             pattern={blackListedShiftPattern}
                                             onChange={updateShiftPattern}
                                             required
                                             type="text"
                                             value={pattern} />&nbsp;
                                          <DashCircleFill className="cursor-pointer" onClick={e => removeShiftPattern(index)} />
                                       </div>
                                    ))
                                 }
                              </div>
                              <div className="align-items-center border border-dark d-flex flex-grow-1 justify-content-center">
                                 <PlusCircleFill className="cursor-pointer" onClick={updateAction.addShiftPattern} />
                              </div>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td className="border border-dark">No. of Working Hour Per Day</td>
                        <td className="border border-dark">
                           <input onChange={updateTextField} name="workingHourPerDay" pattern="\d+.?\d*" required type="text" value={ito.workingHourPerDay} />
                        </td>
                     </tr>
                     <tr>
                        <td className="border border-dark">Join Date</td>
                        <td className="border border-dark">
                           <DatePicker 
                              locale="en-ca"                                                         
                              onChange={joinDate=>updateTextField({target:{name:"joinDate",value:joinDate}})} 
                              required={true}
                              value={ito.joinDate} />
                        </td>
                     </tr>
                     <tr>
                        <td className="border border-dark">Leave Date</td>
                        <td className="border border-dark">
                           <DatePicker 
                              locale="en-ca"
                              onChange={leaveDate=>updateTextField({target:{name:"leaveDate",value:leaveDate}})} 
                              required={true}
                              value={ito.leaveDate} />
                           &nbsp;"2099-12-31" mean active member
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
      )
   }
}