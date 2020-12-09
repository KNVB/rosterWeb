import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
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
        <Route exact path='/rosterWeb' component={RosterViewer} />
      </Switch>
   </Router>
  ); 
}

export default App;
