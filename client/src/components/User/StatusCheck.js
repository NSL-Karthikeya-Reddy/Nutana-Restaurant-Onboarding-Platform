import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHourglass, FaClipboardList, FaExclamationCircle } from 'react-icons/fa';

const StatusCheck = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRestaurant(null);

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/restaurants/check/${uniqueId}`
      );

      setRestaurant(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to find restaurant'
      );
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle style={{ color: 'green', fontSize: '3rem' }} />;
      case 'rejected':
        return <FaTimesCircle style={{ color: 'red', fontSize: '3rem' }} />;
      default:
        return <FaHourglass style={{ color: 'orange', fontSize: '3rem' }} />;
    }
  };

  const getStatusClass = (status) => {
    if (status === 'approved') return 'badge badge-success';
    if (status === 'rejected') return 'badge badge-danger';
    return 'badge badge-pending';
  };

  return (
    <div className="status-container">
      <div className="card">
        <div className="card-header">
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            margin: 0
          }}>
            <FaSearch /> Check Restaurant Status 📋
          </h2>
        </div>
        <form onSubmit={submitHandler} style={{ marginTop: 'var(--spacing-md)' }}>
          <div className="form-group">
            <label htmlFor="uniqueId" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              <FaClipboardList /> Enter Restaurant ID
            </label>
            <input
              type="text"
              id="uniqueId"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              placeholder="Enter the unique ID provided🔑"
              required
              style={{ 
                padding: 'var(--spacing-sm)',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: 'var(--border-radius)',
                width: '100%'
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ 
              width: '100%',
              marginTop: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-xs)'
            }}
          >
            {loading ? 'Checking... ⏳' : 'Check Status 🔍'}
          </button>
        </form>

        {error && (
          <div className="alert alert-danger" style={{ 
            marginTop: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <FaExclamationCircle /> {error} ❌
          </div>
        )}

        {restaurant && (
          <div className="restaurant-status" style={{ 
            marginTop: 'var(--spacing-xl)', 
            textAlign: 'center',
            padding: 'var(--spacing-lg)',
            background: '#f8f9fa',
            borderRadius: 'var(--border-radius)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              {getStatusIcon(restaurant.status)}
            </div>
            <h3 style={{ 
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--secondary-color)',
              fontSize: '1.5rem'
            }}>
              {restaurant.name} 🏪
            </h3>
            <p style={{ 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.1rem'
            }}>
              <strong>Status:</strong>{' '}
              <span className={getStatusClass(restaurant.status)}>
                {restaurant.status.toUpperCase()}
              </span>
            </p>
            {restaurant.adminComments && (
              <div style={{ 
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'white',
                borderRadius: 'var(--border-radius)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <p style={{ 
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: 'bold',
                  color: 'var(--secondary-color)'
                }}>
                  Admin Comments 💬
                </p>
                <p style={{ 
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {restaurant.adminComments}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCheck;