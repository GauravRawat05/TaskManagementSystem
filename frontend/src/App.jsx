import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import PagesLayout from './components/Layout/PagesLayout';
import Login from './components/auth/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import WorkPlaceHome from './components/components/WorkPlaceHome';
import AcceptInvite from './components/components/AcceptInvite';
import NotFoundPage from './pages/NotFoundPage'
import WorkspaceRoleRouter from './components/dashboard/WorkspaceRoleRouter';

const App = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route element={<PagesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Protected Workspace Routes with Nested Structure */}
      <Route element={<ProtectedRoute />}>
        {/* Main workspace routing based on role */}
        <Route path="/workspace/:workspaceId/*" element={<WorkspaceRoleRouter />} />

        {/* Redirect root workspaces to first workspace (handled by component usually) */}
        <Route path="/workspaces" element={<WorkPlaceHome />} />
        <Route path="/dashboard" element={<Navigate to="/workspaces" replace />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};



export default App;
