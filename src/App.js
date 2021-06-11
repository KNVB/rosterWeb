import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
import RosterViewer from './components/rosterViewer/RosterViewer';
import Viewer from './testing/xx/components/rosterViewer/RosterViewer';
import Admin from './testing/xx/components/rosterAdmin/RosterAdmin';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/rosterWeb' component={RosterViewer} />
        <Route path='/rosterWeb/admin' component={RosterAdmin}/>
        <Route path='/rosterWeb/xx/admin' component={Admin}/>
        <Route path='/rosterWeb/xx/viewer' component={Viewer}/>
      </Switch>
    </Router>
  );
}
export default App;
