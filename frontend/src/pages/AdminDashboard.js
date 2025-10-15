import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authHelpers } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    male_users: 0,
    female_users: 0,
    savings_accounts: 0,
    current_accounts: 0,
    total_balance: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [kycMessage, setKycMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycRequests, setKycRequests] = useState([]);


  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await adminAPI.getDashboard();
        setStats(statsResponse.data);

        // Fetch all users
        const usersResponse = await adminAPI.listUsers();
        setUsers(usersResponse.data);

        // Fetch pending KYC requests
        try {
          const kycResp = await adminAPI.listKycRequests();
          setKycRequests(kycResp.data || []);
        } catch (e) {
          console.warn('Failed to fetch KYC requests', e);
        }

        // Fetch pending profile update requests
        try {
          const updateResp = await adminAPI.listUpdateRequests();
          setPendingUpdates(updateResp.data || []);
        } catch (e) {
          console.warn('Failed to fetch update requests', e);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          authHelpers.removeToken();
          navigate('/admin-login');
        } else {
          setMessage('Failed to load dashboard data');
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    authHelpers.removeToken();
    navigate('/');
  };

  const handleKycAction = async (id, action) => {
    try {
      const resp = await adminAPI.processKycRequest(id, action.toLowerCase());
      setKycMessage(resp.data.msg || `KYC ${action} processed`);

      // Remove the processed request from the list
      setKycRequests(prev => prev.filter(r => r.id !== id));
      setTimeout(() => setKycMessage(''), 3000);
    } catch (error) {
      console.error('KYC action error:', error);
      setKycMessage('Failed to process KYC action');
    }
  };

  const handleApproveUpdate = async (updateId) => {
    try {
      const resp = await adminAPI.processUpdateRequest(updateId, 'approve');
      setMessage(resp.data.msg || 'Update approved successfully');
      
      // Remove the processed request from the list
      setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Approve update error:', error);
      setMessage('Failed to approve update');
    }
  };

  const handleRejectUpdate = async (updateId) => {
    try {
      const resp = await adminAPI.processUpdateRequest(updateId, 'reject');
      setMessage(resp.data.msg || 'Update rejected successfully');
      
      // Remove the processed request from the list
      setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Reject update error:', error);
      setMessage('Failed to reject update');
    }
  };

  const filteredUsers = users.filter(user =>
    user.account_number?.includes(searchQuery.trim()) || 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-navbar">
          <span className="dashboard-logo">AVS Bank</span>
          <span className="dashboard-title">Admin Dashboard</span>
        </nav>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <span className="dashboard-logo">AVS Bank</span>
        <span className="dashboard-title">Admin Dashboard</span>
        <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
      </nav>

      {message && <div className="actions-message" style={{margin: '20px', textAlign: 'center'}}>{message}</div>}

      {/* Dashboard Stats */}
      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stats-card"><h3>Total Users</h3><p>{stats.total_users}</p></div>
          <div className="stats-card"><h3>Male Users</h3><p>{stats.male_users}</p></div>
          <div className="stats-card"><h3>Female Users</h3><p>{stats.female_users}</p></div>
          <div className="stats-card"><h3>Savings Accounts</h3><p>{stats.savings_accounts}</p></div>
          <div className="stats-card"><h3>Current Accounts</h3><p>{stats.current_accounts}</p></div>
          <div className="stats-card balance-card"><h3>Total Balance</h3><p>₹{stats.total_balance.toLocaleString()}</p></div>
        </div>
      </main>

      {/* KYC Management */}
      <main className="dashboard-main">
        <section className="dashboard-actions">
          <h2 className="actions-heading">KYC Management</h2>
          {kycRequests.length > 0 ? (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account No</th>
                  <th>Phone</th>
                  <th>KYC Documents</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycRequests.map(req => {
                  const user = users.find(u => u.id === req.user_id) || {};
                  return (
                    <tr key={req.id}>
                      <td>{user.name || 'Unknown'}</td>
                      <td>{req.account_number || user.account_number || 'N/A'}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                          <a href={req.pancard_image} target="_blank" rel="noreferrer">View PAN</a>
                          <a href={req.photo_image} target="_blank" rel="noreferrer">View Photo</a>
                          <a href={req.signature_image} target="_blank" rel="noreferrer">View Signature</a>
                        </div>
                      </td>
                      <td>{req.timestamp}</td>
                      <td>
                        <button onClick={() => handleKycAction(req.id, 'approve')}>Approve</button>
                        <button onClick={() => handleKycAction(req.id, 'reject')}>Reject</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No pending KYC requests.</p>
          )}
          {kycMessage && <div className="actions-message">{kycMessage}</div>}
        </section>
      </main>

      {/* Pending Profile Updates */}
      <main className="dashboard-main">
        <section className="dashboard-actions">
          <h2 className="actions-heading">Pending Profile Updates</h2>
          {pendingUpdates.length === 0 ? (
            <p>No pending updates.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Account No</th>
                  <th>Field</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUpdates.map(update => {
                  const user = users.find(u => u.id === update.user_id) || {};
                  return (
                    <tr key={update.id}>
                      <td>{user.name || 'Unknown'}</td>
                      <td>{user.account_number || 'N/A'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{update.field}</td>
                      <td>{update.old_value || '-'}</td>
                      <td style={{ color: 'green', fontWeight: 'bold' }}>{update.new_value}</td>
                      <td>{update.timestamp}</td>
                      <td>
                        <button onClick={() => handleApproveUpdate(update.id)}>Approve</button>
                        <button onClick={() => handleRejectUpdate(update.id)}>Reject</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* List of Users Button */}
      <main className="dashboard-main">
        <button className="list-users-btn" onClick={() => setShowUserList(!showUserList)}>
          {showUserList ? 'Hide List of Users' : 'List of Users'}
        </button>

        {showUserList && (
          <div className="dashboard-actions">
            <h2 className="actions-heading">All Users</h2>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by Account Number"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account No</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.account_number || 'N/A'}</td>
                    <td>{user.phone}</td>
                    <td>{user.account_type}</td>
                    <td>₹{user.initial_balance?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
