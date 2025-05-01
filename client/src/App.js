import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import CombinedRegister from './components/Auth/CombinedRegister';
import UserDashboard from './components/User/UserDashboard';
import RestaurantForm from './components/User/RestaurantForm';
import RestaurantList from './components/User/RestaurantList';
import StatusCheck from './components/User/StatusCheck';
import AdminDashboard from './components/Admin/AdminDashboard';
import RestaurantDetails from './components/Admin/RestaurantDetails';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children, isAdmin = false }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (isAdmin && user.role !== 'admin') {
      return <Navigate to="/" />;
    }

    return children;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} logout={logout} />
        <main className="container">
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<CombinedRegister setUser={setUser} />} />
            <Route path="/check-status" element={<StatusCheck />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-restaurant"
              element={
                <ProtectedRoute>
                  <RestaurantForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurant/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <RestaurantDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;