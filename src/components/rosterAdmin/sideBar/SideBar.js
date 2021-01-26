import React from 'react';
import Utility from '../../../utils/Utility';
import { slide as Menu } from 'react-burger-menu';
import "./SideBar.css";
function SideBar(props){
    function logout(){
        Utility.fetchAPI('/privateAPI/logout','POST')
        .then(result=>{
            props.auth("false");
        })
        .catch(err=>{
          alert("Something wrong when logout the system: "+err.message);  
        })
    }
    return (
        <Menu disableAutoFocus width={ '250px' }>
            <a className="menu-item" href="/rosterWeb/admin/rosterScheduler">
                Roster Scheduler
            </a>
            <a className="menu-item" href="/rosterWeb/admin/itoManagement">
                ITO Management
            </a>
            <a className="menu-item pointer" onClick={logout}>
                Logout
            </a>
        </Menu>
    );
}
export default SideBar;

