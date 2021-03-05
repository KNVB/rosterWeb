import { Redirect,BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import AdminHome from './AdminHome';
import GuardedRoute from './GuardedRoute';
import ITOManagment from './itoManagement/ITOManagement';
import LoginForm from './LoginForm';
import React,{useState} from 'react';
import './RosterAdmin.css';
import RosterScheduler from './rosterScheduler/RosterScheduler';
import Sidebar from './sideBar/SideBar';
function RosterAdmin(props){
	function changeLoggedInFlag(v){
		if (v==="true"){
			sessionStorage.setItem("isLoggedIn","true");
		} else {
			sessionStorage.clear();
		}
		setIsLoggedin(v);
	}
	const[isLoggedin, setIsLoggedin] = useState(sessionStorage.getItem("isLoggedIn"));
    if (isLoggedin==="true"){
		return (
			<Router>
				<GuardedRoute auth={isLoggedin}	path='/rosterWeb/admin/'>
					<Sidebar pageWrapId={'page-wrap'} auth={changeLoggedInFlag}/>
						<div id="page-wrap" className="d-flex align-items-center flex-column m-0 flex-grow-1">
							<div>
								<h1 className="p-0 m-0 caption">EMSTF Roster Admin. Page</h1>
							</div>
							<Switch>
								<Route exact path="/rosterWeb/admin" component={AdminHome} />
								<Route exact path='/rosterWeb/admin/itoManagement' component={ITOManagment} />
								<Route exact path='/rosterWeb/admin/rosterScheduler' render={()=>props.systemParam && <RosterScheduler systemParam={props.systemParam}/>} />
							</Switch>
						</div>					
				</GuardedRoute>					
			</Router>
		);
	} else {
		return <LoginForm auth={changeLoggedInFlag}/>		
	}		
}
export default RosterAdmin;