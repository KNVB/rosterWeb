import {useEffect,useState} from 'react';
import './ITOManagementPanel.css';
import AdminUtility from '../AdminUtility';
import { Fragment } from 'react';
export default function ITOManagementPanel(props){
    const [itoManagmentData,setITOManagmentData]=useState();
    const [itoFormData,setITOFormData]=useState([]);
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get All ITO information from DB");
            let adminUtility = new AdminUtility(props.changeLoggedInFlag);
            let temp=await adminUtility.getAllITOList();
            let activeShiftInfoList= await adminUtility.getAllActiveShiftInfo();
           
            setITOManagmentData(
                {
                    allITOList:temp,
                    activeShiftInfoList:activeShiftInfoList
                }
            );
        }
        getData();
    },[props.changeLoggedInFlag])
    useEffect(()=>{
        if (itoManagmentData){
            let temp=[], activeShiftList=[];
            for (const [itoId, ito] of Object.entries(itoManagmentData.allITOList)){
                temp.push(
                    <tr key={itoId}>
                        <td className="p-1 text-left">{ito.itoName}</td>
                        <td>{ito.postName}</td>
                        <td>{ito.availableShiftList.join(',')}</td>
                        <td>{ito.workingHourPerDay}</td>
                    </tr>
                )
            }
            Object.keys(itoManagmentData.activeShiftInfoList).forEach(key=>{
                if ((key!=='essentialShift') &&(key!=='s')){
                    activeShiftList.push(
                        <div className="align-items-center d-flex flex-row flex-grow-1 justify-content-start" key={key}>
                            <span>{key}</span><input type="checkbox" value={key} checked/>
                        </div>
                    )
                }
            })
            setITOFormData({activeShiftList:activeShiftList,itoRowList:temp});
        }
    },[itoManagmentData])
    
    return (
        <Fragment>
            <div className="d-flex flex-column flex-grow-1 justify-content-center">
                <table className="itoListTable">
                    <thead>
                        <tr>
                            <th>ITO Name</th>
                            <th>Post Name</th>
                            <th>Avaliable Shift Type</th>
                            <th>No. of Working Hour Per Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itoFormData.itoRowList}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" className="p-1 text-right">
                                <button>Add New ITO</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <br/>
            <form className="d-flex flex-column flex-grow-1 justify-content-center">
                <table className="itoDetailTable">
                    <tbody>
                        <tr>
                            <td>ITO Name</td>
                            <td><input type="text" name="itoName" required/></td>
                        </tr>
                        <tr>
                            <td>Post Name</td>
                            <td><input type="text" name="postName" required/></td>
                        </tr>
                        <tr>
                            <td>Avaliable Shift Type</td>
                            <td>
                                <div className="d-flex w-75 flex-row justify-content-start">
                                    {itoFormData.activeShiftList}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Black Listed Shift Type</td>
                        </tr>
                        <tr>
                            <td>No. of Working Hour Per Day</td>
                            <td><input type="number" step="0.01" name="workingHourPerDay" required/></td>
                        </tr>
                        <tr>
                            <td>Join Date</td>
                            <td><input type="text" name="joinDate" required readOnly/></td>
                        </tr>
                        <tr>
                            <td>Leave Date</td>
                            <td>
                                <input type="text" name="leaveDate" required readOnly/>
						        "2099-12-31" mean active member
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="p-1 text-right">
                                <button>Update</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            
            </form>
        </Fragment>
    )
}