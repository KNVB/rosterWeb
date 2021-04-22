import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import {useEffect,useState} from 'react';

//import DD from './components/testing/DD';
//import JJ from './components/testing/jj/JJ';
//import QQ from './components/testing/qq/QQ';
//import P8 from './components/testing/p8/P8';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
//import RosterViewer from './components/rosterViewer/RosterViewer';
//import SelectDemo from './components/testing/SelectDemo';
import Undo from './components/testing/undo/Undo';
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
          <Route exact path='/rosterWeb/undo/' render={()=>systemParam && <Undo systemParam={systemParam}/>} />
          <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
{/*  
          <Route exact path='/rosterWeb/p8' render={()=>systemParam && <P8 systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb' render={()=>systemParam && <RosterViewer systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/qq' render={()=>systemParam && <QQ systemParam={systemParam}/>} />
          <Route exact path='/rosterWeb/jj' render={()=>systemParam && <JJ systemParam={systemParam}/>} />
          <Route path='/rosterWeb/admin' render={()=>systemParam && <RosterAdmin systemParam={systemParam}/>} />
*/}          
      </Switch>
    </Router>
  );
}
export default App;
