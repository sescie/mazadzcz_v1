import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '100px 0' }}>
        <div className="container">
          <h1>About Mazadzicz</h1>
          {/* Add about page content here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;