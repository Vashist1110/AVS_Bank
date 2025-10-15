import React, { useState } from 'react';
import './UserDashboard.css';

const userDetails = {
  name: 'Ayush Kumar',
  phone: '9876543210',
  accountNo: '123456789012',
  accountType: 'Savings',
  dob: '1998-05-15',
  aadhar: '1234-5678-9012',
  pan: 'ABCDE1234F',
  balance: 25000,
};

function UserDashboard() {
  const [balance, setBalance] = useState(userDetails.balance);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('deposit');
  const [transferAcc, setTransferAcc] = useState('');
  const [message, setMessage] = useState('');

  const handleTransaction = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage('Enter a valid amount.');
      return;
    }
    if (action === 'deposit') {
      setBalance(balance + amt);
      setMessage(`Deposited ₹${amt} successfully.`);
    } else if (action === 'withdraw') {
      if (amt > balance) {
        setMessage('Insufficient balance.');
      } else {
        setBalance(balance - amt);
        setMessage(`Withdrew ₹${amt} successfully.`);
      }
    } else if (action === 'transfer') {
      if (!transferAcc) {
        setMessage('Enter recipient account number.');
      } else if (amt > balance) {
        setMessage('Insufficient balance.');
      } else {
        setBalance(balance - amt);
        setMessage(`Transferred ₹${amt} to ${transferAcc} successfully.`);
      }
    }
    setAmount('');
    setTransferAcc('');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <span className="dashboard-logo">AVS Bank</span>
        <span className="dashboard-title">User Dashboard</span>
        <button className="dashboard-logout">Logout</button>
      </nav>

      <section className="dashboard-main">
        <div className="dashboard-details">
          <h2 className="details-heading">Account Details</h2>
          <div><b>Name:</b> {userDetails.name}</div>
          <div><b>Phone:</b> {userDetails.phone}</div>
          <div><b>Account No:</b> {userDetails.accountNo}</div>
          <div><b>Type:</b> {userDetails.accountType}</div>
          <div><b>DOB:</b> {userDetails.dob}</div>
          <div><b>Aadhar:</b> {userDetails.aadhar}</div>
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