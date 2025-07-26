import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '100px 0' }}>
        <div className="container">
          <h1>Contact Us</h1>
          {/* Add contact page content here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;