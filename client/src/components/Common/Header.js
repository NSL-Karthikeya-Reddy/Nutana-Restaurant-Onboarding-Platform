import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaSignInAlt, FaUserPlus, FaCrown, FaSignOutAlt, FaUtensils } from 'react-icons/fa';

const Header = ({ user, logout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="brand-link">
          <h1 className="brand-title" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            letterSpacing: '0.5px'
          }}>
            <img 
              src="/logonutana.png" 
              alt="Nutana Logo" 
              className="brand-icon" 
              style={{ 
                width: '35px', 
                height: 'auto', 
                maxHeight: '30px',
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
              }}
            />
            <span style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: '#000000',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Nutana Restaurant Onboarding Platform  
              <FaUtensils style={{ 
                verticalAlign: 'middle', 
                color: '#000000',
                fontSize: '1.0 em'
              }} />
            </span>
          </h1>
        </Link>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                <FaHome /> <span>Home</span>
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/check-status" className="nav-link">
                    <FaClipboardList /> <span>Check Status</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    <FaSignInAlt /> <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link">
                    <FaUserPlus /> <span>Register</span>
                  </Link>
                </li>
              </>
            ) : user.role === 'admin' ? (
              <>
                <li>
                  <Link to="/admin" className="nav-link">
                    <FaCrown /> <span>Admin</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={logout} className="nav-link logout-link">
                    <FaSignOutAlt /> <span>Logout</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    <FaClipboardList /> <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-restaurant" className="nav-link">
                    <FaUtensils /> <span>Add Restaurant</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={logout} className="nav-link logout-link">
                    <FaSignOutAlt /> <span>Logout</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;