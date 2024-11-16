import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ITOManagement from './components/rosterAdmin/itoManagment/ITOManagement';
import RosterAdminContent from "./components/rosterAdmin/RosterAdminContent";
import RosterViewer from "./components/rosterViewer/RosterViewer";
import RosterScheduler from "./components/rosterAdmin/rosterScheduler/RosterScheduler";
import TestAutoPlan from "./testing/testAutoPlan/TestAutoPlan";
import TestModal from "./testing/testingModal/TestModal";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/test' element={<TestAutoPlan />} />
        <Route path='/' element={<RosterViewer />} />
        <Route path='/admin' element={<RosterAdminContent />}>
          <Route index element={<RosterAdminContent />} />
          <Route path="itoManagement/:action" element={<ITOManagement />} />
          <Route path="rosterScheduler" element={<RosterScheduler/>}/>
        </Route>
      </Routes>
    </Router>
  );
}