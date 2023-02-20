import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RosterAdmin from './components/rosterAdmin/RosterAdmin';
import RosterViewer from './components/rosterViewer/RosterViewer';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer/>} />
        <Route path='/rosterWeb/admin' element={<RosterAdmin/>}/>
      </Routes>
    </Router>
  );
}
export default App;
