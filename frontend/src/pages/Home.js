import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

// Import images from assets folder
import savingsImg from '../assets/savings_shop.jpg';
import currentImg from '../assets/current.jpg';
import nriImg from '../assets/nri.jpg';
import creditImg from '../assets/credit_card.webp';
import debitImg from '../assets/debit.jpg';
import personalLoanImg from '../assets/loan.webp';
import businessImg from '../assets/businessLending.jpg';
import exclusiveImg from '../assets/exclusive.jpg';
import familyHomeImg from '../assets/family.jpg';

const products = [
  {
    title: 'Everyday Savings Account',
    description: 'Enjoy easy access and great interest rates with our Everyday Savings Account.',
    color: '#e31837',
    img: savingsImg,
  },
  {
    title: 'Current Account',
    description: 'Manage your business transactions with our flexible Current Account.',
    color: '#005baa',
    img: currentImg,
  },
  {
    title: 'NRI Account',
    description: 'Bank from anywhere in the world with our secure NRI Account options.',
    color: '#009e60',
    img: nriImg,
  },
  {
    title: 'Credit Card',
    description: 'Get rewards, cashback, and more with AVS Bank Credit Cards.',
    color: '#f68b1e',
    img: creditImg,
  },
  {
    title: 'Debit Card',
    description: 'Shop and withdraw cash easily with AVS Bank Debit Cards.',
    color: '#6c3483',
    img: debitImg,
  },
  {
    title: 'Personal Loan',
    description: 'Quick approval and flexible repayment for your personal needs.',
    color: '#d35400',
    img: personalLoanImg,
  },
  {
    title: 'Business Lending',
    description: 'Grow your business with our tailored lending solutions.',
    color: '#34495e',
    img: businessImg,
  },
  {
    title: 'AVS Exclusives',
    description: 'Exclusive offers and products for AVS customers.',
    color: '#8e44ad',
    img: exclusiveImg,
  },
];

const helpCards = [
  {
    title: 'Visit Help Center',
    description: 'Get information on all topics',
    icon: '❓',
  },
  {
    title: 'Contact us',
    description: 'Get in touch with a phone banking expert',
    icon: '☎️',
  },
  {
    title: 'Locate us',
    description: 'Find a branch or ATM near you',
    icon: '📍',
  },
  {
    title: 'Report a fraud',
    description: 'Raise a dispute or report suspicious transaction',
    icon: '⚠️',
  },
  {
    title: 'Lodge a complaint',
    description: 'Raise a grievance for any service deficiency',
    icon: '📝',
  },
];

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  padding: '1rem 1rem 2rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
};

const buttonStyle = (bg) => ({
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1.2rem',
  margin: '0.5rem 0.5rem 0 0',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'background 0.2s',
});

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home-container">
      {/* Sticky Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">AVS Bank</span>
        </div>
        
        {/* Hamburger Menu for Mobile */}
        <button 
          className="hamburger-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <span>Personal</span>
          <span>Business</span>
          <span>NRI</span>
          <span>About Us</span>
          <span>Learn</span>
          <span>Help</span>
        </div>

        {/* Auth Buttons */}
        <div className={`navbar-buttons ${isMobileMenuOpen ? 'active' : ''}`}>
          <button className="btn-login">Login</button>
          <button className="btn-register"
          onClick={() => navigate('/create_account')}
          >Create Account</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Own your dream home, with best AVS Home Loans rate!
          </h1>
          <p className="hero-subtitle">
            Interest rate now starting at <b>7.99%* p.a.</b>
          </p>
          <button className="btn-apply">
            Apply Now
          </button>
        </div>
        <div className="hero-image">
          <img
            src={familyHomeImg}
            alt="Family Home"
          />
        </div>
      </section>

      {/* Products Cards Section */}
      <section className="products-section">
        <h2 className="section-title">
          Explore Our Products
        </h2>
        <div className="products-grid">
          {products.map((product, idx) => (
            <div
              key={product.title}
              style={{
                ...cardStyle,
                borderTop: `6px solid ${product.color}`,
              }}
              className="product-card"
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${product.color}33`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
              }}
            >
              <img
                src={product.img}
                alt={product.title}
                className="product-image"
              />
              <h3 style={{ color: product.color }} className="product-title">
                {product.title}
              </h3>
              <p className="product-description">{product.description}</p>
              <div className="product-buttons">
                <button style={buttonStyle(product.color)}>Know More</button>
                <button style={buttonStyle('#222')}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help Section */}
      <section className="help-section">
        <h2 className="section-title-help">
          Need Help?
        </h2>
        <div className="help-cards-container">
          {helpCards.map(card => (
            <div key={card.title} className="help-card">
              <div className="help-icon">{card.icon}</div>
              <div className="help-title">{card.title}</div>
              <div className="help-description">{card.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">AVS Bank</h3>
            <p className="footer-tagline">Banking made simple, secure, and accessible for everyone.</p>
            <div className="social-links">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Products</h4>
            <ul>
              <li><a href="#">Savings Account</a></li>
              <li><a href="#">Current Account</a></li>
              <li><a href="#">Credit Cards</a></li>
              <li><a href="#">Personal Loans</a></li>
              <li><a href="#">Home Loans</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Online Banking</a></li>
              <li><a href="#">Mobile Banking</a></li>
              <li><a href="#">NRI Banking</a></li>
              <li><a href="#">Business Banking</a></li>
              <li><a href="#">Investment</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Find Branch</a></li>
              <li><a href="#">Report Fraud</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Legal</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 AVS Bank. All rights reserved.</p>
          <p className="footer-disclaimer">
            AVS Bank is licensed and regulated. Your deposits are insured up to applicable limits.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;