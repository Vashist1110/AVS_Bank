import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authHelpers } from '../services/api';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('deposit');
  const [transferAcc, setTransferAcc] = useState('');
  const [message, setMessage] = useState('');
  const [kycCompleted, setKycCompleted] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserDetails(response.data);
        setBalance(response.data.initial_balance || 0);
        setKycCompleted(response.data.kyc_status === 'completed');
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

    setMessage(''); // Clear previous messages
    setTransactionLoading(true);

    try {
      if (action === 'deposit') {
        const response = await userAPI.deposit(amt);
        // Backend returns new_balance
        setBalance(response.data.new_balance);
        setMessage(response.data.msg || `Deposited ₹${amt} successfully.`);
      } else if (action === 'withdraw') {
        if (amt > balance) {
          setMessage('Insufficient balance.');
          setTransactionLoading(false);
          return;
        }
        const response = await userAPI.withdraw(amt);
        // Backend returns new_balance
        setBalance(response.data.new_balance);
        setMessage(response.data.msg || `Withdrew ₹${amt} successfully.`);
      } else if (action === 'transfer') {
        if (!transferAcc) {
          setMessage('Enter recipient account number.');
          setTransactionLoading(false);
          return;
        }
        if (amt > balance) {
          setMessage('Insufficient balance.');
          setTransactionLoading(false);
          return;
        }
        // Note: transfer endpoint needs to be implemented in backend
        setMessage('Transfer feature coming soon.');
        setTransactionLoading(false);
        return;
      }
      setAmount('');
      setTransferAcc('');
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Transaction error:', error);
      if (error.response?.status === 401) {
        authHelpers.removeToken();
        navigate('/login');
      } else {
        setMessage(error.response?.data?.msg || 'Transaction failed. Please try again.');
      }
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-bg">
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
      <div className="dashboard-bg">
        <nav className="dashboard-navbar">
          <span className="dashboard-logo">AVS Bank</span>
          <span className="dashboard-title">User Dashboard</span>
        </nav>
        <div style={{ textAlign: 'center', padding: '50px' }}>Failed to load user details.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg">
      <nav className="dashboard-navbar">
        <span className="dashboard-logo">AVS Bank</span>
        <span className="dashboard-title">User Dashboard</span>
        <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <section className="dashboard-main improved-dashboard-main">
        {/* User Details Card */}
        <div className="improved-details-card">
          <div className="details-header">
            <div className="details-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div>
              <h2 className="details-heading">{userDetails.name}</h2>
              <span className="details-type">{userDetails.account_type} Account</span>
            </div>
          </div>
          <div className="details-list">
            <div>
              <span className="details-label">Account No:</span>
              <span className="details-value">{userDetails.account_number || 'N/A'}</span>
            </div>
            <div>
              <span className="details-label">Phone:</span>
              <span className="details-value">{userDetails.phone}</span>
            </div>
            <div>
              <span className="details-label">DOB:</span>
              <span className="details-value">{userDetails.dob}</span>
            </div>
            <div>
              <span className="details-label">Aadhar:</span>
              <span className="details-value">{userDetails.adhaar}</span>
            </div>
            <div>
              <span className="details-label">PAN:</span>
              <span className="details-value">{userDetails.pan}</span>
            </div>
          </div>
          <div className="details-balance-card">
            <span className="balance-label">Current Balance</span>
            <span className="balance-value">₹{balance.toLocaleString()}</span>
          </div>
          <button
            className="details-kyc"
            disabled={kycCompleted}
            style={kycCompleted ? { background: '#009e60', cursor: 'not-allowed' } : {}}
            onClick={() => !kycCompleted && navigate('/kyc')}
          >
            {kycCompleted ? 'KYC Completed' : 'Update KYC'}
          </button>
        </div>

        {/* Transaction Section */}
        <div className="improved-actions-card">
          <h3 className="actions-heading">Money Operations</h3>
          <form onSubmit={handleTransaction} className="actions-form">
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
                placeholder="Enter amount"
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
                  placeholder="Recipient Account Number"
                />
              </div>
            )}
            <button type="submit" className="actions-submit" disabled={transactionLoading}>
              {transactionLoading 
                ? 'Processing...' 
                : action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          </form>
          {message && <div className="actions-message">{message}</div>}
          <div className="actions-tips">
            <span>💡 Tip: Always double-check account numbers before transferring funds.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;