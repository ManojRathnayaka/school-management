// React Router imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context imports
import { AuthProvider, useAuth } from './context/AuthContext';

// Component imports
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Page imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Students from './pages/Students';
import StudentRegistration from './pages/StudentRegistration';
import Scholarships from './pages/Scholarships';
import Events from './pages/Events';
import AcademicSports from './pages/AcademicSports';
import ParentPortal from './pages/ParentPortal';

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><Students /></ProtectedRoute>} />
            <Route path="/student-registration" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><StudentRegistration /></ProtectedRoute>} />
            <Route path="/scholarships" element={<ProtectedRoute allowedRoles={['principal', 'teacher', 'student', 'parent']}><Scholarships /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute allowedRoles={['principal', 'teacher']}><Events /></ProtectedRoute>} />
            <Route path="/academic-sports" element={<ProtectedRoute allowedRoles={['principal', 'teacher', 'student', 'parent']}><AcademicSports /></ProtectedRoute>} />
            <Route path="/parent-portal" element={<ProtectedRoute allowedRoles={['parent']}><ParentPortal /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;