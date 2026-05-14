import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateCourse from './pages/teacher/CreateCourse';
import CourseManage from './pages/teacher/CourseManage';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseCourses from './pages/student/BrowseCourses';
import CourseView from './pages/student/CourseView';
import DashboardLayout from './layouts/DashboardLayout';
import './index.css';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} /> : <RegisterPage />} />
      
      {/* Teacher routes */}
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="course/:id" element={<CourseManage />} />
      </Route>

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="course/:id" element={<CourseView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
