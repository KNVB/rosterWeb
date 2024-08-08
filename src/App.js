import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ITOManagement from './components/rosterAdmin/itoManagment/ITOManagement';
import Login from './components/rosterAdmin/Login';
import RosterAdminGateKeeper from './components/rosterAdmin/RosterAdminGateKeeper';
import RosterScheduler from "./components/rosterAdmin/rosterScheduler/RosterScheduler";
import RosterViewer from './components/rosterViewer/RosterViewer';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RosterViewer />} />
        <Route path='/admin' element={<RosterAdminGateKeeper />}>
          <Route index element={<RosterAdminGateKeeper />} />
          <Route path="itoManagement/:action" element={<ITOManagement />} />
          <Route path="rosterScheduler" element={<RosterScheduler />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}