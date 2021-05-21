import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
//import DD from './components/testing/DD';
//import RosterAdmin from './components/rosterAdmin/RosterAdmin';
//import RosterViewer from './components/rosterViewer/RosterViewer';
//import VV from './components/testing/vv/VV';
import Viewer from './components/testing/xx/viewer/Viewer';
import XX from './components/testing/xx/admin/XX';
//import Utility from './utils/Utility';
function App() {  
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => 
          (
            <Redirect to="/rosterWeb"/>
          )
        }/>
        <Route exact path='/rosterWeb/xx/admin' component={XX} />
        <Route exact path='/rosterWeb' component={Viewer} />
{/*  
          <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/vv/' render={()=>systemParam && <VV systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb' render={()=>systemParam && <RosterViewer systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/xx/' render={()=>systemParam && <XX systemParam={systemParam}/>} />
          <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} /> 
          <Route exact path='/rosterWeb/redo/' render={()=>systemParam && <Redo systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/undo/' render={()=>systemParam && <Undo systemParam={systemParam}/>} />
          <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/p8' render={()=>systemParam && <P8 systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/vv/' render={()=>systemParam && <VV systemParam={systemParam}/>} /> 
          <Route exact path='/rosterWeb/qq' render={()=>systemParam && <QQ systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/jj' render={()=>systemParam && <JJ systemParam={systemParam}/>} />
*/}          
      </Switch>
    </Router>
  );
}
export default App;
