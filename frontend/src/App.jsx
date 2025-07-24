import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PendingApproval from './pages/PendingApproval';
import Students from './pages/Students';
import StudentRegistration from './pages/StudentRegistration';
import Scholarships from './pages/Scholarships';
import Events from './pages/Events';
import AcademicSports from './pages/AcademicSports';
import ParentPortal from './pages/ParentPortal';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pending" element={<PendingApproval />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/events" element={<Events />} />
          <Route path="/academic-sports" element={<AcademicSports />} />
          <Route path="/parent-portal" element={<ParentPortal />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;