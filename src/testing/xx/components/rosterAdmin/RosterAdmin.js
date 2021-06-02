import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import './RosterAdmin.css';
import AdminHome from './AdminHome';
import ITOManagment from './itoManagement/ITOManagement';
import RosterScheduler from './rosterScheduler/RosterScheduler';
import Sidebar from './sideBar/SideBar';
export default function RosterAdmin(props){
	let changeLoggedInFlag=(v)=>{};
	return (
		<Router>
				<Sidebar pageWrapId={'page-wrap'} auth={changeLoggedInFlag}/>
				<div id="page-wrap" className="d-flex align-items-center flex-column m-0 flex-grow-1">
					<div>
						<h1 className="p-0 m-0 caption">EMSTF Roster Admin. Page</h1>
					</div>
					<Switch>
						<Route exact path="/rosterWeb/xx/admin" component={AdminHome} />
						<Route path='/rosterWeb/xx/admin/itoManagement' component={ITOManagment} />
						<Route path='/rosterWeb/xx/admin/rosterScheduler' render={()=><RosterScheduler changeLoggedInFlag={changeLoggedInFlag}/>} />
					</Switch>
				</div>
		</Router>
	);
}