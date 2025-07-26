// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../services/api';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/AuthForm.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await apiLogin(email, password);

      if (!token || !user) {
        setError('Login failed: please try again.');
        return;
      }

      // Save auth & redirect by role:
      setAuth({ token, user });
      const dest = user.role === 'admin'
        ? '/admin/dashboard'
        : '/investor/dashboard';
      navigate(dest);

    } catch (err) {
      // Prefer the exact message from your API helper, if it exists:
      const msg = err.message?.toLowerCase() || '';

      if (msg.includes('invalid credentials') || err.response?.status === 401) {
        setError('Invalid email or password.');
      }
      else if (err.response?.status === 404 || msg.includes('user not found')) {
        setError('User not found. Please register first.');
      }
      else if (err.response && err.response.status < 500) {
        // any other 4xx
        setError('Login failed. Please check your input.');
      }
      else {
        // network error or 5xx
        setError('Unable to connect. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Log In</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <p className="auth-footer">
              Don’t have an account?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
