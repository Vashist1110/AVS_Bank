import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authHelpers } from '../services/api';
import './KYC.css'; // Reusing KYC styles for consistency

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
    <div className="kyc-bg">
      <div className="kyc-card">
        <div className="kyc-header">
          <h2 className="kyc-title">Update Profile Request</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            Submit a request to update your profile information. Changes will be reviewed by admin.
          </p>
        </div>

        <form className="kyc-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="kyc-documents-list">
            {/* Name */}
            <div className="kyc-applicant" style={{ marginBottom: '20px' }}>
              <label className="kyc-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Email */}
            <div className="kyc-applicant" style={{ marginBottom: '20px' }}>
              <label className="kyc-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Phone */}
            <div className="kyc-applicant" style={{ marginBottom: '20px' }}>
              <label className="kyc-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Gender */}
            <div className="kyc-applicant" style={{ marginBottom: '20px' }}>
              <label className="kyc-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="kyc-applicant" style={{ marginBottom: '20px' }}>
              <label className="kyc-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {error && <div className="kyc-error">{error}</div>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              className="kyc-submit-btn" 
              disabled={loading || submitted}
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting...' : submitted ? 'Submitted!' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
          
          {submitted && (
            <div className="kyc-success">
              Update request submitted successfully! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
