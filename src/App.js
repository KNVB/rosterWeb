import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RosterViewer from './components/rosterViewer/RosterViewer';
function App() {  
  return (
    <Router>
      <Switch>
        <Route exact path='/rosterWeb' component={RosterViewer} />
      </Switch>
    </Router>
  );
}
export default App;
