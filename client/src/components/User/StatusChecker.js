import React, { useState } from 'react';
import { FaClipboardList, FaSearch, FaExclamationCircle, FaStore, FaHome, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatusChecker = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [restaurant, setRestaurant] = useState(null);

  const handleCheckStatus = async () => {
    setLoading(true);
    setError('');
    setRestaurant(null);

    try {
      const response = await fetch(`/api/restaurants/${uniqueId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setRestaurant(data.restaurant);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-checker" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--spacing-xl)',
      background: '#f8f9fa'
    }}>
      <div className="card" style={{ 
        width: '100%',
        maxWidth: '900px',
        margin: '2rem auto',
        padding: 0,
        borderRadius: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#ffc107',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            color: '#2d3436',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}>
            <FaSearch style={{ fontSize: '2rem' }} /> Check Restaurant Status 📋
          </h1>
        </div>

        <div style={{ padding: 'var(--spacing-xl)' }}>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label htmlFor="uniqueId" style={{ 
              display: 'block',
              marginBottom: 'var(--spacing-md)',
              fontSize: '1.4rem',
              color: '#2d3436',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <FaClipboardList /> Enter Restaurant ID 🔑
            </label>
            <input
              type="text"
              id="uniqueId"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              placeholder="Enter your restaurant's unique ID"
              style={{ 
                width: '100%',
                padding: 'var(--spacing-lg)',
                fontSize: '1.2rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                marginBottom: 'var(--spacing-lg)',
                transition: 'all 0.3s ease'
              }}
            />
            <button 
              onClick={handleCheckStatus} 
              className="btn"
              style={{ 
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-lg)',
                fontSize: '1.3rem',
                borderRadius: '12px',
                background: '#ffc107',
                color: '#2d3436',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
            >
              <FaSearch /> Check Status 🔍
            </button>
          </div>

          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-lg)',
              fontSize: '1.1rem',
              color: '#666'
            }}>
              <p>Checking status... ⏳</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-md)',
              marginTop: 'var(--spacing-md)'
            }}>
              <FaExclamationCircle /> {error} ❌
            </div>
          ) : restaurant ? (
            <div className="status-details" style={{ 
              padding: 'var(--spacing-md)',
              background: '#f8f9fa',
              borderRadius: 'var(--border-radius)',
              marginTop: 'var(--spacing-md)'
            }}>
              <h2 style={{ 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--secondary-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <FaStore /> {restaurant.name} ��
              </h2>
              
              <div style={{ 
                display: 'grid',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  <strong style={{ minWidth: '120px' }}>Status:</strong>
                  <span className={`badge badge-${restaurant.status}`} style={{ 
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    {restaurant.status === 'pending' && '⏳ Pending Review'}
                    {restaurant.status === 'approved' && '✅ Approved'}
                    {restaurant.status === 'rejected' && '❌ Rejected'}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  <strong style={{ minWidth: '120px' }}>Submitted:</strong>
                  <span style={{ color: '#666' }}>
                    {new Date(restaurant.createdAt).toLocaleDateString()} 📅
                  </span>
                </div>

                {restaurant.adminComments && (
                  <div style={{ 
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    alignItems: 'flex-start'
                  }}>
                    <strong style={{ minWidth: '120px' }}>Comments:</strong>
                    <p style={{ 
                      color: '#666',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {restaurant.adminComments} 💬
                    </p>
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-lg)'
              }}>
                <Link 
                  to="/" 
                  className="btn btn-secondary"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.9rem'
                  }}
                >
                  <FaHome /> Back to Home 🏠
                </Link>
                <Link 
                  to="/add-restaurant" 
                  className="btn"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.9rem'
                  }}
                >
                  <FaPlus /> Add New Restaurant ➕
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StatusChecker; 