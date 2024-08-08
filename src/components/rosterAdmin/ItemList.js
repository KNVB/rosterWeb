import './ItemList.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AdminUtil from '../../util/AdminUtil';
export default function ItemList(){
    const navigate = useNavigate();
    let adminUtil = new AdminUtil();
    let logout = async () => {
        try {
            let logoutResult = await adminUtil.logout();
            if (logoutResult.isSuccess) {
                alert("Logout Success");
            }
        } catch (error) {
            alert("An error occur when logout Call Tree to administration page:\n" + error.message);
        }
        finally {
            sessionStorage.clear();
            navigate("/login");
        }
    }
    return (
        <ul className='itemList'>
            <li>
                <a href="/admin/rosterScheduler">Roster Scheduler</a>
            </li>
            <li>
                <a href="/admin/itoManagement/list">ITO Management</a>
            </li>
            <li>
                <span className='logout' onClick={logout}>
                    Logout
                </span>
            </li>    
        </ul>
    );        
}