import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import {useEffect,useState} from 'react';
//import DD from './components/testing/DD';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
import RosterViewer from './components/rosterViewer/RosterViewer';
import Utility from './utils/Utility';
function App() {
  const[systemParam,setSystemParam]=useState();
  useEffect(()=>{
    const getData = async () => {
      let temp=await Utility.getSystemParam();
      setSystemParam(temp);
    }
    getData();
  },[setSystemParam]);
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => 
          (
            <Redirect to="/rosterWeb"/>
          )
        }/>
        <Route exact path='/rosterWeb' render={()=>systemParam && <RosterViewer systemParam={systemParam}/>} />
        <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
      </Switch>
    </Router>
  );
}

export default App;
