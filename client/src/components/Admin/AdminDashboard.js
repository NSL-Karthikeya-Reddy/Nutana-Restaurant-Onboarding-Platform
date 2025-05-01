import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCrown, FaEye, FaFilter, FaSearch, FaExclamationCircle, FaStore, FaPhone, FaCalendarAlt, FaUser, FaCheckCircle, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.name) {
      setUserName(userInfo.name);
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:5000/api/restaurants/admin',
          config
        );
        
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'badge badge-success';
    if (status === 'rejected') return 'badge badge-danger';
    return 'badge badge-pending';
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Filter by status
    const statusMatch = filter === 'all' || restaurant.status === filter;
    
    // Filter by search term
    const searchMatch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="dashboard" style={{ padding: '2rem 4rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Section */}
      <div className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1.5rem 2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          margin: 0,
          fontSize: '2rem'
        }}>
          <FaCrown /> Admin Dashboard
        </h1>
        <div className="user-info" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          background: '#f8f9fa',
          borderRadius: '20px',
          fontSize: '1.1rem'
        }}>
          <FaUser />
          <span>{userName}</span>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="controls-section" style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Search Box */}
        <div className="search-box" style={{ 
          background: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1rem',
            background: '#f8f9fa',
            padding: '1rem 1.5rem',
            borderRadius: '6px'
          }}>
            <FaSearch style={{ color: '#666' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants by name..."
              style={{ 
                flex: 1,
                border: 'none',
                padding: '0.5rem',
                fontSize: '1.1rem',
                background: 'transparent',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filter Box */}
        <div className="filter-box" style={{ 
          background: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1rem',
            background: '#f8f9fa',
            padding: '1rem 1.5rem',
            borderRadius: '6px'
          }}>
            <FaFilter style={{ color: '#666' }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                flex: 1,
                border: 'none',
                padding: '0.5rem',
                fontSize: '1.1rem',
                background: 'transparent',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Restaurants 🏪</option>
              <option value="pending">Pending Approval ⏳</option>
              <option value="approved">Approved ✅</option>
              <option value="rejected">Rejected ❌</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '1.1rem',
          color: '#666'
        }}>
          Loading restaurants... ⏳
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1.5rem 2rem',
          borderRadius: '8px'
        }}>
          <FaExclamationCircle /> {error}
        </div>
      ) : (
        <div className="restaurants-table" style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          padding: '0.5rem'
        }}>
          {filteredRestaurants.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              fontSize: '1.1rem',
              color: '#666'
            }}>
              <p>No restaurants found 🏪</p>
            </div>
          ) : (
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f8f9fa'
                }}>
                  <th style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0',
                    width: '25%'
                  }}>
                    <FaStore /> Name
                  </th>
                  <th style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0',
                    width: '20%'
                  }}>
                    <FaPhone /> Contact
                  </th>
                  <th style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0',
                    width: '15%'
                  }}>
                    <FaCheckCircle /> Status
                  </th>
                  <th style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0',
                    width: '20%'
                  }}>
                    <FaCalendarAlt /> Submitted
                  </th>
                  <th style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0',
                    width: '20%'
                  }}>
                    <FaCog /> Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant._id} style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {restaurant.name}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {restaurant.contactPhone}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span className={getStatusBadgeClass(restaurant.status)}>
                        {restaurant.status === 'approved'}
                        {restaurant.status === 'pending'}
                        {restaurant.status === 'rejected'}
                        {restaurant.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <Link 
                        to={`/admin/restaurant/${restaurant._id}`} 
                        className="btn"
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          textDecoration: 'none'
                        }}
                      >
                        <FaEye /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;