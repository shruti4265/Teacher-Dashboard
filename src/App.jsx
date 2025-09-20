import { Routes, Route } from 'react-router-dom';
import TeacherDashboard from './pages/teacherDashboard';
import './App.css'; 
import Frontpage from './pages/frontPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      <Route path='/teacherDashboard' element={<TeacherDashboard/>}/>
    </Routes>
  );
}

export default App;