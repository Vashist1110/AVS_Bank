import React, { useState } from 'react';
import './Create_Account.css';

function UserLogin() {
  const [form, setForm] = useState({
    contact: '',
    password: '',
    robot: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.contact.trim()) newErrors.contact = 'Contact number is required';
    else if (!/^[0-9]{10}$/.test(form.contact.trim())) newErrors.contact = 'Contact number must be 10 digits';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.robot) newErrors.robot = 'Please confirm you are not a robot';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      alert('Login successful!');
      setForm({ contact: '', password: '', robot: false });
    }
  };

  return (
    <div className="account-page-bg">
      <div className="avs-topbar">
        <span className="avs-bank-name">AVS Bank</span>
      </div>
      <div className="avs-banner">
        <h1>Welcome Back!</h1>
        <p>Login to access your account and enjoy Zero Fee Banking</p>
        <div className="account-benefits">
          <span><i className="icon-calendar" /> <span className="benefit-label">Monthly Interest Credits</span></span>
          <span><i className="icon-card" /> <span className="benefit-label">Exclusive Debit Card Offers</span></span>
          <span><i className="icon-atm" /> <span className="benefit-label">Unlimited ATM Transactions</span></span>
        </div>
      </div>
      <div className="account-form-container">
        <h2>User Login</h2>
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-row">
            <div className="account-field">
              <label>Contact Number*</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Aadhaar linked mobile"
              />
              {errors.contact && <span className="error">{errors.contact}</span>}
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
          <button type="submit" className="account-submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
