import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats] = useState({
    total_users: 4,
    male_users: 2,
    female_users: 2,
    savings_accounts: 3,
    current_accounts: 1,
    total_balance: 185000,
  });

  const [users] = useState([
    {
      id: 1,
      name: 'Ayush Kumar',
      accountNo: '123456789012',
      phone: '9876543210',
      account_type: 'Savings',
      initial_balance: 25000,
      kycStatus: 'Pending',
    },
    {
      id: 2,
      name: 'Riya Sharma',
      accountNo: '987654321098',
      phone: '9123456780',
      account_type: 'Current',
      initial_balance: 50000,
      kycStatus: 'Approved',
    },
    {
      id: 3,
      name: 'Ankit Verma',
      accountNo: '456789123456',
      phone: '9988776655',
      account_type: 'Savings',
      initial_balance: 60000,
      kycStatus: 'Approved',
    },
    {
      id: 4,
      name: 'Neha Singh',
      accountNo: '321654987321',
      phone: '9871234560',
      account_type: 'Savings',
      initial_balance: 45000,
      kycStatus: 'Rejected',
    },
  ]);

  const [pendingUpdates, setPendingUpdates] = useState([
    {
      id: 101,
      userId: 1,
      requested: {
        phone: '9998887776',
        account_type: 'Current',
      },
      timestamp: '2025-10-15 14:30',
    },
  ]);

  const [kycMessage, setKycMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleKycAction = (id, action) => {
    setKycMessage(`KYC ${action} for user ID ${id}`);
    setTimeout(() => setKycMessage(''), 3000);
  };

  const handleApproveUpdate = (updateId) => {
    setPendingUpdates(pendingUpdates.filter(u => u.id !== updateId));
  };

  const handleRejectUpdate = (updateId) => {
    setPendingUpdates(pendingUpdates.filter(u => u.id !== updateId));
  };

  const filteredUsers = users.filter(user =>
    user.accountNo.includes(searchQuery.trim())
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <span className="dashboard-logo">AVS Bank</span>
        <span className="dashboard-title">Admin Dashboard</span>
        <button className="dashboard-logout">Logout</button>
      </nav>

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
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account No</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Balance</th>
                <th>KYC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.accountNo}</td>
                  <td>{user.phone}</td>
                  <td>{user.account_type}</td>
                  <td>₹{user.initial_balance.toLocaleString()}</td>
                  <td>
                    <span className={`kyc-badge ${user.kycStatus.toLowerCase()}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td>
                    {user.kycStatus === 'Pending' && (
                      <>
                        <button onClick={() => handleKycAction(user.id, 'Approved')}>Approve</button>
                        <button onClick={() => handleKycAction(user.id, 'Rejected')}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <th>Requested Changes</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUpdates.map(update => {
                  const user = users.find(u => u.id === update.userId);
                  return (
                    <tr key={update.id}>
                      <td>{user?.name}</td>
                      <td>{user?.accountNo}</td>
                      <td>
                        {Object.entries(update.requested).map(([key, val]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {user?.[key]} → <span style={{ color: 'green' }}>{val}</span>
                          </div>
                        ))}
                      </td>
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
                    <td>{user.accountNo}</td>
                    <td>{user.phone}</td>
                    <td>{user.account_type}</td>
                    <td>₹{user.initial_balance.toLocaleString()}</td>
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
