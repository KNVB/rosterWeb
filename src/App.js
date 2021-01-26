import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import ITOManagment from './components/rosterAdmin/itoManagement/ITOManagement';
import RosterAdmin from './components/rosterAdmin/RosterAdmin'
import RosterViewer from './components/rosterViewer/RosterViewer';
import RosterScheduler from './components/rosterAdmin/rosterScheduler/RosterScheduler';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => 
          (
            <Redirect to="/rosterWeb"/>
          )
        }/>
        <Route exact path='/rosterWeb' component={RosterViewer} />
        <Route path='/rosterWeb/admin' component={RosterAdmin} />
        <Route exact path='/rosterWeb/admin/itoManagement' component={ITOManagment} />
        <Route exact path='/rosterWeb/admin/rosterScheduler' component={RosterScheduler} />
      </Switch>
    </Router>
  );
}

export default App;
