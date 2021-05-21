import { slide as Menu } from 'react-burger-menu';
import React from 'react';
import Utility from '../../../utils/Utility';
//import SessionExpiredError from '../../../utils/SessionExpiredError';
import "./SideBar.css";
function SideBar(props){
    async function logout(){
        try{
            await Utility.fetchAPI('/privateAPI/logout','POST');
        }catch(error){
            console.log(error);
            /*
            if (error instanceof SessionExpiredError){
                //console.log("changeLoggedInFlag");
                props.auth("false");
            } else {
                throw error;
            }
            */
        }
        finally{
            props.auth("false");
        }
    }
    return (
        <Menu disableAutoFocus width={ '250px' }>
            <a className="menu-item" href="/rosterWeb/admin/rosterScheduler">
                Roster Scheduler
            </a>
            <a className="menu-item" href="/rosterWeb/admin/itoManagement">
                ITO Management
            </a>
            <div className="menu-item pointer" onClick={logout}>
                Logout
            </div>
        </Menu>
    );
}
export default SideBar;

