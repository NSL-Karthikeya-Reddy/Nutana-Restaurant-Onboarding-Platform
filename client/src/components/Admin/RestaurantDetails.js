import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [status, setStatus] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          `http://localhost:5000/api/restaurants/${id}`,
          config
        );
        
        setRestaurant(data);
        setStatus(data.status);
        setAdminComments(data.adminComments);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch restaurant details');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const updateStatusHandler = async () => {
    setUpdateLoading(true);
    setError('');
    setUpdateSuccess('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/restaurants/${id}/status`,
        { status, adminComments },
        config
      );
      
      setRestaurant(data);
      setUpdateSuccess('Restaurant status updated successfully');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update restaurant status'
      );
    }
    
    setUpdateLoading(false);
  };

  return (
    <div className="restaurant-details">
      <button onClick={() => navigate('/admin')} className="btn" style={{ marginBottom: '1rem' }}>
        <FaArrowLeft /> Back to Dashboard
      </button>
      
      {loading ? (
        <p>Loading restaurant details...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : restaurant ? (
        <div className="card">
          <div className="card-header">
            <h2>Restaurant Details: {restaurant.name}</h2>
          </div>
          
          {updateSuccess && <div className="alert alert-success">{updateSuccess}</div>}
          
          <div className="grid-2">
            <div>
              <h3>Basic Information</h3>
              <p>
                <strong>Name:</strong> {restaurant.name}
              </p>
              <p>
                <strong>Description:</strong> {restaurant.description}
              </p>
              <p>
                <strong>Contact Phone:</strong> {restaurant.contactPhone}
              </p>
              <p>
                <strong>Business Hours:</strong> {restaurant.businessHours}
              </p>
              <p>
                <strong>Unique ID:</strong> {restaurant.uniqueId}
              </p>
              <p>
                <strong>Submitted On:</strong>{' '}
                {new Date(restaurant.createdAt).toLocaleString()}
              </p>
              
              <h3 style={{ marginTop: '1.5rem' }}>Restaurant Logo</h3>
              {restaurant.logo && (
                <img
                  src={`http://localhost:5000/${restaurant.logo}`}
                  alt={restaurant.name}
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }}
                />
              )}
              
              <h3 style={{ marginTop: '1.5rem' }}>Certificate</h3>
              {restaurant.certificate && (
                <a
                  href={`http://localhost:5000/${restaurant.certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.9rem',
                    marginTop: 'var(--spacing-sm)'
                  }}
                >
                  View Certificate PDF
                </a>
              )}
            </div>
            
            <div>
              <h3>Update Status</h3>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="adminComments">Admin Comments</label>
                <textarea
                  id="adminComments"
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  placeholder="Add comments for the restaurant owner"
                  rows="6"
                ></textarea>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-md)'
              }}>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setStatus('approved');
                    setAdminComments(
                      'Congratulations! Your restaurant has been approved. You are now part of our network.'
                    );
                  }}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.9rem'
                  }}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setStatus('rejected');
                    setAdminComments(
                      'Unfortunately, we cannot approve your restaurant at this time. Please ensure all information is accurate and complete.'
                    );
                  }}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.9rem'
                  }}
                >
                  <FaTimesCircle /> Reject
                </button>
              </div>
              
              <button
                onClick={updateStatusHandler}
                className="btn"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-danger">Restaurant not found</div>
      )}
    </div>
  );
};

export default RestaurantDetails;