import './App.css';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import CreateAccount from './pages/Create_Account';
import Login from './pages/User_Login';
import AdminLogin from './pages/Admin_Login';
import AdminDashboard from './pages/AdminDashboard';
import Kyc from "./pages/KYC";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute, AdminRoute, AdminPublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* User Routes - Protected from logged-in users */}
          <Route path="/create_account" element={
            <PublicRoute>
              <CreateAccount />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* User Dashboard - Only for logged-in users */}
          <Route path="/user-dashboard" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/kyc" element={
            <PrivateRoute>
              <Kyc />
            </PrivateRoute>
          } />
          
          {/* Admin Routes - Protected from logged-in admins */}
          <Route path="/admin-login" element={
            <AdminPublicRoute>
              <AdminLogin />
            </AdminPublicRoute>
          } />
          
          {/* Admin Dashboard - Only for logged-in admins */}
          <Route path="/admin-dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;