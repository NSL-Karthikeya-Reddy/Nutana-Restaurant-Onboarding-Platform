import React, { useState } from 'react';
import axios from 'axios';
import { FaBuilding, FaImage, FaFileUpload } from 'react-icons/fa';

const RestaurantForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [logo, setLogo] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState('');


  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validation
    if (!logo || !certificate) {
      setError('Please upload both logo and certificate');
      setLoading(false);
      return;
    }

    // Check file types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedDocTypes = ['application/pdf'];

    if (!allowedImageTypes.includes(logo.type)) {
      setError('Logo must be JPG, JPEG or PNG format');
      setLoading(false);
      return;
    }

    if (!allowedDocTypes.includes(certificate.type)) {
      setError('Certificate must be PDF format');
      setLoading(false);
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('contactPhone', contactPhone);
    formData.append('businessHours', businessHours);
    formData.append('logo', logo);
    formData.append('certificate', certificate);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/restaurants',
        formData,
        config
      );

      setSuccess('Restaurant submitted successfully!');
      setUniqueId(data.uniqueId);
      
      // Reset form fields
      setName('');
      setDescription('');
      setContactPhone('');
      setBusinessHours('');
      setLogo(null);
      setCertificate(null);
      
      // Reset file input fields
      document.getElementById('logo').value = '';
      document.getElementById('certificate').value = '';
      
      // No navigation - stay on the form page
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to submit restaurant'
      );
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <h2>
            <FaBuilding /> Add New Restaurant 🏪
          </h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <p>Your restaurant's unique ID: <strong>{uniqueId}</strong></p>
            <p>Use this ID to check your restaurant's status.</p>
          </div>
        )}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Restaurant Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter restaurant name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter restaurant description"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone</label>
            <input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Enter contact phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="businessHours">Business Hours</label>
            <input
              type="text"
              id="businessHours"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="logo">
              <FaImage /> Restaurant Logo (JPG, JPEG, PNG only)
            </label>
            <input
              type="file"
              id="logo"
              onChange={(e) => setLogo(e.target.files[0])}
              accept=".jpg,.jpeg,.png"
              required
            />
            <small className="form-text">Upload restaurant logo image</small>
          </div>
          <div className="form-group">
            <label htmlFor="certificate">
              <FaFileUpload /> Restaurant Certificate (PDF only)
            </label>
            <input
              type="file"
              id="certificate"
              onChange={(e) => setCertificate(e.target.files[0])}
              accept=".pdf"
              required
            />
            <small className="form-text">Upload food safety certificate or business license</small>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Restaurant 🍽️'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;