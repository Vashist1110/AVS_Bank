import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authHelpers } from '../services/api';
import Notification from '../components/Notification';
import './Create_Account.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    robot: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.robot) newErrors.robot = 'Please confirm you are not a robot';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const credentials = {
          username: form.username,
          password: form.password
        };
        
        const response = await adminAPI.login(credentials);
        
        if (response.data.access_token) {
          authHelpers.saveToken(response.data.access_token, 'admin');
          setNotification({ message: 'Admin login successful! Redirecting...', type: 'success' });
          setTimeout(() => {
            navigate('/admin-dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Admin login error:', error);
        if (error.response?.status === 401) {
          setNotification({ message: 'Invalid username or password', type: 'error' });
        } else if (error.response?.data?.msg) {
          setNotification({ message: error.response.data.msg, type: 'error' });
        } else {
          setNotification({ message: 'Login failed. Please try again.', type: 'error' });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="account-page-bg">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="avs-topbar">
        <span className="avs-bank-name">AVS Bank</span>
      </div>
      <div className="avs-banner">
        <h1 className="admin-welcome-center">
          <span className="admin-welcome-drop">
            {'WELCOME ADMIN'.split('').map((char, i) => (
              <span key={i} className="drop-letter" style={{animationDelay: `${i * 0.08}s`}}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </span>
        </h1>
        <p style={{textAlign: 'center'}}>Login to manage the bank and users securely</p>
      </div>
      <div className="account-form-container">
        <h2>Admin Login</h2>
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-row">
            <div className="account-field">
              <label>Username*</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Admin username"
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            <div className="account-field">
              <label>Password*</label>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={{flex: 1}}
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{marginLeft: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #d32f2f', background: showPassword ? '#d32f2f' : '#fff', color: showPassword ? '#fff' : '#d32f2f', cursor: 'pointer'}}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </div>
          <div className="account-row">
            <div className="account-field">
              <label className="robot-checkbox-label">
                <input
                  type="checkbox"
                  name="robot"
                  checked={form.robot}
                  onChange={handleChange}
                  className="robot-checkbox"
                />
                I'm not a robot
              </label>
              {errors.robot && <span className="error">{errors.robot}</span>}
            </div>
          </div>
          <button type="submit" className="account-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <style>{`
        .admin-welcome-center {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 0;
          min-height: 80px;
        }
        .admin-welcome-drop {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .drop-letter {
          display: inline-block;
          font-size: 3rem;
          font-weight: bold;
          color: #d32f2f;
          letter-spacing: 2px;
          opacity: 0;
          transform: translateY(-60px);
          animation: dropIn 0.5s forwards;
        }
        @keyframes dropIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive styles for admin welcome text */
        @media (max-width: 768px) {
          .admin-welcome-center {
            min-height: 60px;
          }
          .drop-letter {
            font-size: 2.2rem;
            letter-spacing: 1px;
          }
        }
        
        @media (max-width: 640px) {
          .admin-welcome-center {
            min-height: 50px;
          }
          .drop-letter {
            font-size: 1.8rem;
            letter-spacing: 0.5px;
          }
        }
        
        @media (max-width: 480px) {
          .admin-welcome-center {
            min-height: 40px;
            padding: 0 8px;
          }
          .drop-letter {
            font-size: 1.4rem;
            letter-spacing: 0px;
          }
          .admin-welcome-drop {
            gap: 1px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;
