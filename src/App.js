import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import AA from './components/testing/AA';
import RosterAdmin from './components/rosterAdmin/RosterAdmin'
import RosterViewer from './components/rosterViewer/RosterViewer';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => 
          (
            <Redirect to="/rosterWeb"/>
          )
        }/>
        <Route exact path='/rosterWeb' component={AA} />
        <Route path='/rosterWeb/admin' component={RosterAdmin} />
      </Switch>
    </Router>
  );
}

export default App;
