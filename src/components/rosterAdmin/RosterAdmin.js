import { BrowserRouter as Router,Redirect } from 'react-router-dom';
import AdminPlatForm from './AdminPlatForm';
import React,{useState} from 'react';
import GuardedRoute from './GuardedRoute';
import LoginForm from './LoginForm';
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
				<GuardedRoute 
					auth={isLoggedin}
					component={()=><AdminPlatForm auth={changeLoggedInFlag}/>}
					path='/rosterWeb/admin/adminPlatform'/>
				<Redirect to='/rosterWeb/admin/adminPlatform/main'/>
			</Router>
		);
	} else {
		return <LoginForm auth={changeLoggedInFlag}/>
	}		
}
export default RosterAdmin;