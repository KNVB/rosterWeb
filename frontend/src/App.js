import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import RosterTable from './components/rosterTable/RosterTable';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => 
            (
              <Redirect to="/rosterWeb"/>
            )
        }/>
        <Route exact path='/rosterWeb' component={RosterTable} />
      </Switch>
   </Router>
  ); 
}

export default App;
