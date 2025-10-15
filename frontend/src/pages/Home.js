import React, { useState } from 'react';

function HomePage() {
  const [showRegister, setShowRegister] = useState(true);

  return (
    <div>
      <nav style={{ background: '#e31837', color: '#fff', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>AVS Bank</span>
          <div>
            <button
              style={{ marginRight: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem' }}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
            <button
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem' }}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', boxShadow: '0 0 10px #ccc', borderRadius: 8 }}>
        <h2 style={{ color: '#e31837', marginBottom: '1.5rem' }}>
          {showRegister ? 'Register as Customer' : 'Login'}
        </h2>
        {showRegister ? (
          <form method="POST" action="/register">
            <div style={{ marginBottom: '1rem' }}>
              <label>Username</label>
              <input type="text" name="username" required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Email</label>
              <input type="email" name="email" required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Password</label>
              <input type="password" name="password" required className="form-control" style={{ width: '100%' }} />
            </div>
            <button type="submit" style={{ background: '#e31837', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 4 }}>
              Register
            </button>
          </form>
        ) : (
          <form method="POST" action="/login">
            <div style={{ marginBottom: '1rem' }}>
              <label>Username</label>
              <input type="text" name="username" required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Password</label>
              <input type="password" name="password" required className="form-control" style={{ width: '100%' }} />
            </div>
            <button type="submit" style={{ background: '#e31837', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 4 }}>
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default HomePage;