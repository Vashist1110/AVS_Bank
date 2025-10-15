import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authHelpers } from '../services/api';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('deposit');
  const [transferAcc, setTransferAcc] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserDetails(response.data);
        setBalance(response.data.initial_balance || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          authHelpers.removeToken();
          navigate('/login');
        } else {
          setMessage('Failed to load profile. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    authHelpers.removeToken();
    navigate('/');
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage('Enter a valid amount.');
      return;
    }

    try {
      if (action === 'deposit') {
        const response = await userAPI.deposit(amt);
        setBalance(response.data.balance);
        setMessage(`Deposited ₹${amt} successfully.`);
      } else if (action === 'withdraw') {
        if (amt > balance) {
          setMessage('Insufficient balance.');
          return;
        }
        const response = await userAPI.withdraw(amt);
        setBalance(response.data.balance);
        setMessage(`Withdrew ₹${amt} successfully.`);
      } else if (action === 'transfer') {
        if (!transferAcc) {
          setMessage('Enter recipient account number.');
          return;
        }
        if (amt > balance) {
          setMessage('Insufficient balance.');
          return;
        }
        // Note: transfer endpoint needs to be implemented in backend
        setMessage('Transfer feature coming soon.');
        return;
      }
      setAmount('');
      setTransferAcc('');
    } catch (error) {
      console.error('Transaction error:', error);
      if (error.response?.status === 401) {
        authHelpers.removeToken();
        navigate('/login');
      } else {
        setMessage(error.response?.data?.msg || 'Transaction failed. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-navbar">
          <span className="dashboard-logo">AVS Bank</span>
          <span className="dashboard-title">User Dashboard</span>
        </nav>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-navbar">
          <span className="dashboard-logo">AVS Bank</span>
          <span className="dashboard-title">User Dashboard</span>
        </nav>
        <div style={{ textAlign: 'center', padding: '50px' }}>Failed to load user details.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <span className="dashboard-logo">AVS Bank</span>
        <span className="dashboard-title">User Dashboard</span>
        <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <section className="dashboard-main">
        <div className="dashboard-details">
          <h2 className="details-heading">Account Details</h2>
          <div><b>Name:</b> {userDetails.name}</div>
          <div><b>Phone:</b> {userDetails.phone}</div>
          <div><b>Account No:</b> {userDetails.account_number || 'N/A'}</div>
          <div><b>Type:</b> {userDetails.account_type}</div>
          <div><b>DOB:</b> {userDetails.dob}</div>
          <div><b>Aadhar:</b> {userDetails.adhaar}</div>
          <div><b>PAN:</b> {userDetails.pan}</div>
          <div className="details-balance"><b>Balance:</b> ₹{balance}</div>
          <button className="details-kyc">Update KYC</button>
        </div>

        <div className="dashboard-actions">
          <h3 className="actions-heading">Money Operations</h3>
          <form onSubmit={handleTransaction}>
            <div className="actions-row">
              <label>Action:</label>
              <select value={action} onChange={e => setAction(e.target.value)}>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div className="actions-row">
              <label>Amount:</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            {action === 'transfer' && (
              <div className="actions-row">
                <label>Recipient Account No:</label>
                <input
                  type="text"
                  value={transferAcc}
                  onChange={e => setTransferAcc(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="actions-submit">
              Submit
            </button>
          </form>
          {message && <div className="actions-message">{message}</div>}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;