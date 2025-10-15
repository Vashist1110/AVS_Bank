import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import './Create_Account.css';

const accountTypes = [
  { value: '', label: 'Select account type' },
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' }
];

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (strength <= 1) return { label: 'Weak', color: 'red' };
  if (strength === 2 || strength === 3) return { label: 'Medium', color: 'orange' };
  if (strength === 4) return { label: 'Strong', color: 'green' };
  return { label: '', color: '' };
}

function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    contact: '',
    email: '',
    dob: '',
    gender: '',
    aadhar: '',
    pan: '',
    accountType: '',
    password: '',
    confirmPassword: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    else if (form.fullName.trim().length < 3) newErrors.fullName = 'Name must be at least 3 characters';
    else if (!/^[A-Za-z ]+$/.test(form.fullName.trim())) newErrors.fullName = 'Name must contain only letters and spaces';

    if (!form.contact.trim()) newErrors.contact = 'Contact number is required';
    else if (!/^[0-9]{10}$/.test(form.contact.trim())) newErrors.contact = 'Contact number must be 10 digits';

    if (!form.dob) newErrors.dob = 'Date of Birth is required';

    if (!form.gender) newErrors.gender = 'Gender is required';

    if (!form.aadhar.trim()) newErrors.aadhar = 'Aadhar card is required';
    else if (!/^[0-9]{12}$/.test(form.aadhar.trim())) newErrors.aadhar = 'Aadhar number must be 12 digits';

    if (!form.pan.trim()) newErrors.pan = 'PAN card is required';
    else if (!/^.{10}$/.test(form.pan.trim())) newErrors.pan = 'PAN card number must be 10 characters';

    if (!form.accountType) newErrors.accountType = 'Account type is required';

    if (!form.password) newErrors.password = 'Password is required';
    else {
      if (!/[A-Z]/.test(form.password)) newErrors.password = 'Password must contain at least one capital letter';
      else if (!/[^A-Za-z0-9]/.test(form.password)) newErrors.password = 'Password must contain at least one special character';
      else if (!/[0-9]/.test(form.password)) newErrors.password = 'Password must contain at least one number';
      else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!form.captchaInput) newErrors.captchaInput = 'Captcha is required';
    else if (form.captchaInput !== captcha) newErrors.captchaInput = 'Captcha does not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        // Prepare data for backend API with all required fields
        const userData = {
          name: form.fullName,
          email: form.email || `user${form.contact}@avsbank.com`,
          password: form.password,
          confirm_password: form.confirmPassword,
          phone: form.contact,
          gender: form.gender,
          dob: form.dob,
          adhaar: form.aadhar,
          pan: form.pan,
          account_type: form.accountType,
          initial_balance: 0,
          type_of_account: form.accountType
        };

        const response = await userAPI.register(userData);
        
        alert('Account created successfully! Please login with your credentials.');
        
        // Reset form
        setForm({
          fullName: '',
          contact: '',
          email: '',
          dob: '',
          gender: '',
          aadhar: '',
          pan: '',
          accountType: '',
          password: '',
          confirmPassword: '',
          captchaInput: ''
        });
        setCaptcha(generateCaptcha());
        
        // Navigate to login page
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response) {
          const errorMsg = error.response.data.msg || error.response.data.message || 'Please try again';
          alert(`Registration failed: ${errorMsg}`);
        } else if (error.request) {
          alert('No response from server. Please check if the backend is running on port 5000.');
        } else {
          alert(`Registration failed: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setForm({ ...form, captchaInput: '' });
  };

  return (
    <div className="account-page-bg">
      <div className="avs-topbar">
        <span className="avs-bank-name">AVS Bank</span>
      </div>
      <div className="avs-banner">
        <h1>Earn up to <span className="highlight">7%*</span> p.a. interest</h1>
        <p>And enjoy Zero Fee Banking on all Savings Account services</p>
        <div className="account-benefits">
          <span><i className="icon-calendar" /> <span className="benefit-label">Monthly Interest Credits</span></span>
          <span><i className="icon-card" /> <span className="benefit-label">Exclusive Debit Card Offers</span></span>
          <span><i className="icon-atm" /> <span className="benefit-label">Unlimited ATM Transactions</span></span>
        </div>
      </div>
      <div className="account-form-container">
        <h2>Enter details to start your savings journey now!</h2>
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-row">
            <div className="account-field">
              <label>Full Name*</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>
            <div className="account-field">
              <label>Contact Number*</label>
              <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Aadhaar linked mobile" />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>
            <div className="account-field">
              <label>Date of Birth*</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>
          </div>
          <div className="account-row">
            <div className="account-field">
              <label>Gender*</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>
            <div className="account-field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
            </div>
            <div className="account-field">
              <label>Aadhar Card*</label>
              <input type="text" name="aadhar" value={form.aadhar} onChange={handleChange} placeholder="12-digit Aadhaar number" />
              {errors.aadhar && <span className="error">{errors.aadhar}</span>}
            </div>
          </div>
          <div className="account-row">
            <div className="account-field">
              <label>PAN Card*</label>
              <input type="text" name="pan" value={form.pan} onChange={handleChange} placeholder="Permanent Account Number (PAN)" />
              {errors.pan && <span className="error">{errors.pan}</span>}
            </div>
            <div className="account-field">
              <label>Type of Account*</label>
              <select name="accountType" value={form.accountType} onChange={handleChange}>
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.accountType && <span className="error">{errors.accountType}</span>}
            </div>
            <div className="account-field">
              <label>New Password*</label>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New password"
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
              <div className="password-requirements">
                <div>Password must contain:</div>
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least 1 capital letter</li>
                  <li>At least 1 special character</li>
                  <li>At least 1 number</li>
                </ul>
              </div>
              {form.password && (
                <div className="password-strength" style={{color: getPasswordStrength(form.password).color}}>
                  Password strength: <span>{getPasswordStrength(form.password).label}</span>
                </div>
              )}
            </div>
            <div className="account-field">
              <label>Confirm Password*</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className="account-row">
            <div className="account-field captcha-field">
              <label>Captcha*</label>
              <div className="captcha-box">
                <span className="captcha-text">{captcha}</span>
                <button type="button" className="refresh-captcha" onClick={handleRefreshCaptcha} title="Refresh Captcha">&#x21bb;</button>
              </div>
              <input type="text" name="captchaInput" value={form.captchaInput} onChange={handleChange} placeholder="Enter captcha" />
              {errors.captchaInput && <span className="error">{errors.captchaInput}</span>}
            </div>
          </div>
          <button type="submit" className="account-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;