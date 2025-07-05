import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for doesn't exist or has been moved.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;