import { slide as Menu } from 'react-burger-menu';
import React from 'react';
import AdminUtility from '../AdminUtility'
import "./SideBar.css";
function SideBar(props){
    async function logout(){
        let adminUtility = new AdminUtility(props.auth);
        adminUtility.logout();        
    }
    return (
        <Menu disableAutoFocus width={ '250px' }>
            <a className="menu-item" href="/rosterWeb/xx/admin/rosterScheduler">
                Roster Scheduler
            </a>
            <a className="menu-item" href="/rosterWeb/xx/admin/itoManagement">
                ITO Management
            </a>
            <div className="menu-item pointer" onClick={logout}>
                Logout
            </div>
        </Menu>
    );
}
export default SideBar;

