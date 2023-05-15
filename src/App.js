import './App.css';
import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from "./components/test/Test";
import RosterAdminGateKeeper from './components/rosterAdmin/RosterAdminGateKeeper';
import RosterScheduler from "./components/rosterAdmin/rosterScheduler/RosterScheduler";
import RosterViewer from './components/rosterViewer/RosterViewer';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Test/>}/>
        <Route path='/rosterWeb' element={<RosterViewer/>} />
        <Route path='/rosterWeb/admin' element={<RosterAdminGateKeeper/>}>          
          <Route path="rosterScheduler" element={<RosterScheduler/>}/>
        </Route>  
      </Routes>
    </Router>
  );
}
export default App;
