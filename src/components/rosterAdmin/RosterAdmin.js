import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import {useState} from 'react';
import './RosterAdmin.css';
import AdminHome from './AdminHome';
import GuardedRoute from './GuardedRoute';
import ITOManagment from './itoManagement/ITOManagement';
import LoginForm from './LoginForm';
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
								<Route path='/rosterWeb/admin/itoManagement' component={ITOManagment} />
								<Route path='/rosterWeb/admin/rosterScheduler' render={()=><RosterScheduler changeLoggedInFlag={changeLoggedInFlag}/>} />
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