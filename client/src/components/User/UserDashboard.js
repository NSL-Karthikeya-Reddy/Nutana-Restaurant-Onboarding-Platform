import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaStore, FaUser, FaSearch } from 'react-icons/fa';

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

        const { data } = await axios.get('http://localhost:5000/api/restaurants', config);
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

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>
          <FaStore /> Approved Restaurants
        </h1>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUser />
          <span>{userName}</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-box" style={{ 
        background: 'white',
        padding: '1.5rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
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

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/add-restaurant" className="btn" style={{ marginBottom: '2rem' }}>
          <FaPlus /> Add New Restaurant 🏪
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="grid-2" style={{ marginTop: '1rem' }}>
          {filteredRestaurants.length === 0 ? (
            <div className="card">
              <p>No restaurants found matching your search.</p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div className="card" key={restaurant._id}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description.substring(0, 100)}...</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={getStatusBadgeClass(restaurant.status)}>
                    {restaurant.status.toUpperCase()}
                  </span>
                </p>
                {restaurant.adminComments && (
                  <p>
                    <strong>Admin Comments:</strong> {restaurant.adminComments}
                  </p>
                )}
                <p>
                  <strong>ID:</strong> {restaurant.uniqueId}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;