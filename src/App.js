import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import {useEffect,useState} from 'react';

//import DD from './components/testing/DD';
import JJ from './components/jj/JJ';
import QQ from './components/qq/QQ';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
import RosterViewer from './components/rosterViewer/RosterViewer';
//import SelectDemo from './components/testing/SelectDemo';
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
        <Route exact path='/rosterWeb/qq' render={()=>systemParam && <QQ systemParam={systemParam}/>} />
        <Route exact path='/rosterWeb/jj' render={()=>systemParam && <JJ systemParam={systemParam}/>} />
        <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
      </Switch>
    </Router>
  );
}

export default App;
