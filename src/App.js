import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ITOManagement from './components/rosterAdmin/itoManagment/ITOManagement';
import RosterViewer from './components/rosterViewer/RosterViewer';
import RosterAdminContent from "./components/rosterAdmin/RosterAdminContent";
import RosterScheduler from "./components/rosterAdmin/rosterScheduler/RosterScheduler";
import TestModal from "./testing/testingModal/TestModal";
import TimeOffManagement from "./components/rosterAdmin/timeOffManagement/TimeOffManagement";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/test' element={<TestModal/>}/>
        <Route path='/' element={<RosterViewer />} /> 
          <Route path='/admin' element={<RosterAdminContent/>}>
            <Route index element={<RosterAdminContent/>}/>
            <Route path="itoManagement/:action" element={<ITOManagement />} />
            <Route path="rosterScheduler" element={<RosterScheduler/>}/>
            <Route path="timeOffManagement/:action" element={<TimeOffManagement />} />
          </Route> 
      </Routes>
    </Router>
  );
}