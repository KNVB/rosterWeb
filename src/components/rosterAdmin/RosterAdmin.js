import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import AdminPlatForm from './AdminPlatForm';
import GuardedRoute from './GuardedRoute';
import ITOManagment from './itoManagement/ITOManagement';
import LoginForm from './LoginForm';
import React,{useState} from 'react';
import RosterScheduler from './rosterScheduler/RosterScheduler';

function RosterAdmin(){
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
					<Switch>
						<Route exact path="/rosterWeb/admin" component={()=><AdminPlatForm auth={changeLoggedInFlag}/>} />
						<Route exact path='/rosterWeb/admin/itoManagement' component={ITOManagment} />
        				<Route exact path='/rosterWeb/admin/rosterScheduler' component={RosterScheduler} />
					</Switch>					
				</GuardedRoute>					
			</Router>
		);
	} else {
		return <LoginForm auth={changeLoggedInFlag}/>
	}		
}
export default RosterAdmin;