import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaStore, FaClipboardList, FaExclamationCircle } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="restaurant-list">
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)'
      }}>
        <FaStore /> Approved Restaurants 🍽️
      </h1>
      
      <div className="card">
        <p className="welcome-text" style={{ 
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginBottom: 'var(--spacing-lg)',
          color: '#555',
          textAlign: 'center'
        }}>
          Welcome to our Restaurant Onboarding platform! 🎉
          <br />
          Browse through our list of approved restaurants or join our network by{' '}
          <Link to="/add-restaurant" style={{ 
            color: 'var(--primary-dark)',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            adding your restaurant 🏪
          </Link>
        </p>
        
        <div className="search-container" style={{ 
          background: '#f8f9fa',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          margin: 'var(--spacing-md) 0'
        }}>
          <div className="search-input" style={{ 
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <FaSearch style={{ color: '#666', marginRight: 'var(--spacing-sm)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants by name... 🔍"
              style={{ 
                border: 'none',
                padding: 'var(--spacing-xs)',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div className="action-buttons" style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-md)'
        }}>
          <Link to="/check-status" className="btn">
            <FaClipboardList /> Check Restaurant Status 📋
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <p>Loading restaurants... ⏳</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <FaExclamationCircle /> {error} ❌
        </div>
      ) : (
        <div className="grid-3" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-lg)',
          padding: 'var(--spacing-md) 0'
        }}>
          {filteredRestaurants.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <p>No restaurants found. 🏪</p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div className="restaurant-card" key={restaurant._id}>
                {restaurant.logo && (
                  <img
                    src={`http://localhost:5000/${restaurant.logo}`}
                    alt={restaurant.name}
                    style={{ 
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div className="restaurant-card-content">
                  <h3 style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--secondary-color)',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    <FaStore /> {restaurant.name}
                  </h3>
                  <p style={{ 
                    color: '#666',
                    marginBottom: 'var(--spacing-sm)',
                    lineHeight: '1.6'
                  }}>
                    {restaurant.description.substring(0, 100)}...
                  </p>
                  <div className="contact-info">
                    <p style={{ 
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}>
                     📞 {restaurant.contactPhone} 
                    </p>
                    <p style={{ 
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}>
                      ⏰ {restaurant.businessHours}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;