import React from 'react';

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
  maxWidth: '340px',
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
  return (
    <div style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
      {/* Sticky Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        color: '#222',
        padding: '1rem 2rem',
        boxShadow: '0 2px 8px #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <img src="https://www.kotak.com/etc.clientlibs/kotak/clientlibs/clientlib-site/resources/images/logo.svg" alt="AVS Bank" style={{ height: 40, marginRight: 12 }} /> */}
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#e31837', letterSpacing: '2px' }}>AVS Bank</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: '500', fontSize: '1rem' }}>
          <span style={{ cursor: 'pointer' }}>Personal</span>
          <span style={{ cursor: 'pointer' }}>Business</span>
          <span style={{ cursor: 'pointer' }}>NRI</span>
          <span style={{ cursor: 'pointer' }}>About Us</span>
          <span style={{ cursor: 'pointer' }}>Learn</span>
          <span style={{ cursor: 'pointer' }}>Help</span>
        </div>
        <div>
          <button style={{
            background: '#e31837',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            padding: '0.5rem 1.2rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginRight: '1rem',
            cursor: 'pointer',
          }}>
            Login
          </button>
          <button style={{
            background: '#005baa',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            padding: '0.5rem 1.2rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
          }}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(90deg, #fff 60%, #e31837 100%)',
        padding: '3rem 2rem 2rem 2rem',
        minHeight: '340px',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: 540 }}>
          <h1 style={{ fontSize: '2.7rem', fontWeight: 'bold', color: '#e31837', marginBottom: '1rem' }}>
            Own your dream home, with best AVS Home Loans rate!
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#222', marginBottom: '2rem' }}>
            Interest rate now starting at <b>7.99%* p.a.</b>
          </p>
          <button style={{
            background: '#e31837',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 2rem',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer'
          }}>
            Apply Now
          </button>
        </div>
        <div>
          <img
            src={familyHomeImg}
            alt="Family Home"
            style={{
              width: '400px',
              borderRadius: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              objectFit: 'cover'
            }}
          />
        </div>
      </section>

      {/* Products Cards Section */}
      <section style={{ padding: '2rem 0', background: '#f7f7f7' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem', color: '#222' }}>
          Explore Our Products
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          padding: '1rem 2rem',
          justifyItems: 'center'
        }}>
          {products.map((product, idx) => (
            <div
              key={product.title}
              style={{
                ...cardStyle,
                borderTop: `6px solid ${product.color}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
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
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}
              />
              <h3 style={{ color: product.color, fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.7rem' }}>
                {product.title}
              </h3>
              <p style={{ color: '#444', marginBottom: '1.2rem', minHeight: '60px' }}>{product.description}</p>
              <div>
                <button style={buttonStyle(product.color)}>Know More</button>
                <button style={buttonStyle('#222')}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help Section */}
      <section style={{ background: '#f2f3f7', padding: '2rem 0 3rem 0' }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#005baa'
        }}>
          Need Help?
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {helpCards.map(card => (
            <div key={card.title} style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              padding: '1.2rem 2rem',
              minWidth: '220px',
              maxWidth: '240px',
              margin: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.7rem'
              }}>{card.icon}</div>
              <div style={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                marginBottom: '0.4rem',
                textAlign: 'center'
              }}>{card.title}</div>
              <div style={{
                color: '#555',
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>{card.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;