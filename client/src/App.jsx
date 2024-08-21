import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PrincipalDashboard from './pages/PrincipalDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/principal-dashboard" 
          element={user ? <PrincipalDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher-dashboard" 
          element={user ? <TeacherDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student-dashboard" 
          element={user ? <StudentDashboard /> : <Navigate to="/login" />} 
        />

        {/* Redirect to login if the path doesn't match any route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
