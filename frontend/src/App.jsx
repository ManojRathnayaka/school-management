// React Router imports
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context imports
import { AuthProvider, useAuth } from './context/AuthContext';

// Component imports
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Page imports
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Students from './pages/Students';
import StudentRegistration from './pages/StudentRegistration';
import Scholarships from './pages/Scholarships';
import Events from './pages/AuditoriumBooking2';
import AcademicSports from './pages/AcademicSports';
import ParentPortal from './pages/ParentPortal';
// import AuditoriumBookingForm from './pages/AuditoriumBooking';
import AuditoriumBookingForm from './pages/AuditoriumBooking2';
import PrincipalAuditoriumManagement from './pages/PrincipalAuditoriumManagement';
import ClassPerformance from './pages/ClassPerformance';
import ScholarshipList from "./pages/ScholarshipPrinciple";
import HostelApplication from './pages/HostelApply';
import AdminDashboard from './pages/HostelAdminDashboard';
import AchievementsSystem from './pages/Academic&SportsAchivements';

function LoginWrapper() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    // Get intended destination from location state
    const from = location.state?.from?.pathname;
    
    if (from) {
      return <Navigate to={from} replace />;
    }
    
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Login />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><Students /></ProtectedRoute>} />
            <Route path="/student-registration" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><StudentRegistration /></ProtectedRoute>} />
            <Route path="/scholarships" element={<ProtectedRoute allowedRoles={[ 'student']}><Scholarships /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><Events /></ProtectedRoute>} />
            <Route path="/academic-sports" element={<ProtectedRoute allowedRoles={['principal', 'teacher', 'student', 'parent']}><AcademicSports /></ProtectedRoute>} />
            <Route path="/parent-portal" element={<ProtectedRoute allowedRoles={['parent']}><ParentPortal /></ProtectedRoute>} />
            <Route path="/auditorium-booking" element={<ProtectedRoute allowedRoles={['teacher']}><AuditoriumBookingForm/></ProtectedRoute>}/>
            <Route path="/auditorium-booking-principal" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalAuditoriumManagement/></ProtectedRoute>}/>
            <Route path="/scholarship-list" element={<ProtectedRoute allowedRoles={['principal']}><ScholarshipList/></ProtectedRoute>}/>
            
            <Route path="/class-performance" element={<ProtectedRoute allowedRoles={['teacher']}><ClassPerformance/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/hostel" element={<HostelApplication />} />
            <Route path="/HostelAdmin" element={<AdminDashboard />} />
            <Route path="/Achive" element={<AchievementsSystem />} />

          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
//gfgffff
export default App;