import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authHelpers } from '../services/api';
import './UpdateProfile.css';

function UpdateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: ''
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        
        // Check if user already has a pending update request
        if (response.data.has_pending_update_request) {
          setError('You already have a pending update request. Please wait for admin approval or rejection.');
          setTimeout(() => {
            navigate('/user-dashboard');
          }, 3000);
          return;
        }
        
        const data = {
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          gender: response.data.gender || '',
          dob: response.data.dob || ''
        };
        setFormData(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          authHelpers.removeToken();
          navigate('/login');
        } else {
          setError('Failed to load profile. Please try again.');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any field has changed
    const changedFields = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      setError('No changes detected. Please modify at least one field.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await userAPI.requestUpdate(changedFields);
      setSubmitted(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Update request error:', error);
      
      if (error.response?.status === 401) {
        authHelpers.removeToken();
        navigate('/login');
      } else if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to submit update request. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-bg">
      <div className="update-profile-card">
        <div className="update-profile-header">
          <h2 className="update-profile-title">Update Profile Request</h2>
          <p className="update-profile-subtitle">
            Submit a request to update your profile information. Changes will be reviewed by admin.
          </p>
        </div>

        <form className="update-profile-form" onSubmit={handleSubmit}>
          <div className="update-form-row">
            {/* Name */}
            <div className="update-form-field full-width">
              <label className="update-form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="update-form-input"
              />
            </div>
          </div>

          <div className="update-form-row">
            {/* Email */}
            <div className="update-form-field">
              <label className="update-form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="update-form-input"
              />
            </div>

            {/* Phone */}
            <div className="update-form-field">
              <label className="update-form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                pattern="[0-9]{10}"
                maxLength="10"
                className="update-form-input"
              />
            </div>
          </div>

          <div className="update-form-row">
            {/* Gender */}
            <div className="update-form-field">
              <label className="update-form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="update-form-select"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="update-form-field">
              <label className="update-form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="update-form-input"
              />
            </div>
          </div>

          {error && <div className="update-error-message">{error}</div>}

          <div className="update-buttons-container">
            <button 
              type="submit" 
              className="update-submit-btn" 
              disabled={loading || submitted}
            >
              {loading ? 'Submitting...' : submitted ? 'Submitted!' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              className="update-cancel-btn"
            >
              Cancel
            </button>
          </div>
          
          {submitted && (
            <div className="update-success-message">
              Update request submitted successfully! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
