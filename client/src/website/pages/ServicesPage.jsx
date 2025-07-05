import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ServicesPage = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '100px 0' }}>
        <div className="container">
          <h1>Our Services</h1>
          {/* Add services page content here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;