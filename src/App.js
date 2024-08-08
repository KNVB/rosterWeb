import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/rosterAdmin/Login';
import RosterViewer from './components/rosterViewer/RosterViewer';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RosterViewer/>} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>    
  );
}