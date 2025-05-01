import React, { useState } from 'react';
import Register from './Register';
import AdminRegister from './AdminRegister';
import { FaUser, FaUserShield } from 'react-icons/fa';

const CombinedRegister = ({ setUser }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Choose Account Type 🎯</h2>
        
        <div className="role-selector">
          <button
            className={`role-option ${selectedRole === 'user' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('user')}
          >
            <FaUser /> Register as User
          </button>
          <button
            className={`role-option ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('admin')}
          >
            <FaUserShield /> Register as Admin
          </button>
        </div>

        {selectedRole === 'user' && <Register setUser={setUser} isStandalone={false} />}
        {selectedRole === 'admin' && <AdminRegister setUser={setUser} isStandalone={false} />}
      </div>
    </div>
  );
};

export default CombinedRegister; 