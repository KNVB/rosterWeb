import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
import RosterViewer from './components/rosterViewer/RosterViewer';
//import Viewer from './testing/xx/viewer/Viewer';
//import XX from './testing/xx/admin/XX';
function App() {  
  return (
    <Router>
      <Switch>
        <Route exact path='/rosterWeb' component={RosterViewer} />
        <Route path='/rosterWeb/admin' component={RosterAdmin}/>
        {/*
        <Route path='/rosterWeb/xx' component={XX}/>
        <Route path='/rosterWeb/viewer' component={Viewer}/>
        */}
      </Switch>
    </Router>
  );
}
export default App;
