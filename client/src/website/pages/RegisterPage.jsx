// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { register as apiRegister,  login as apiLogin} from '../../services/api';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/RegisterPagePure.css';

const initial = {
  full_name: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  password: '',
  confirmPassword: '',
  terms: false,
  showPw: false
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [step, setStep]           = useState(0);
  const [data, setData]           = useState(initial);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const { auth, setAuth } = useAuth();

  const steps = ['Personal','Contact','Address','Security','Review'];

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setData(d => ({ ...d, [name]: type==='checkbox' ? checked : value }));
    setErrors(e => ({ ...e, [name]: '' }));
    setApiError(null);
    setSuccessMsg('');
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!data.full_name.trim()) errs.full_name = 'Required';
      if (!data.dob)             errs.dob       = 'Required';
      if (!data.gender)          errs.gender    = 'Required';
    }
    if (step === 1) {
      if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = 'Valid email required';
      if (!/^\+?\d{7,15}$/.test(data.phone)) errs.phone = 'Valid phone required';
    }
    if (step === 2) {
      ['address','city','state','zip','country'].forEach(f => {
        if (!data[f].trim()) errs[f] = 'Required';
      });
    }
    if (step === 3) {
      if (data.password.length < 8)               errs.password        = 'Min 8 chars';
      if (data.confirmPassword !== data.password) errs.confirmPassword = 'Must match';
      if (!data.terms)                            errs.terms           = 'You must accept';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s+1, steps.length-1));
  };
  const back = () => setStep(s => Math.max(s-1,0));

  const strengthScore = pw => {
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setApiError(null);
    setSuccessMsg('');

    const payload = {
      email:               data.email,
      password:            data.password,
      full_name:           data.full_name,
      phone:               data.phone,
      date_of_birth:       data.dob,
      nationality:         '',
      residential_address: data.address,
      city:                data.city,
      state:               data.state,
      postal_code:         data.zip,
      country:             data.country,
      terms_accepted:      data.terms ? 1 : 0,
      role:                'investor'
    };

    try {
      const res = await apiRegister(payload);
      setSuccessMsg(res?.message || 'Registration successful!');

      // Now auto-login with the same credentials
      const loginRes = await apiLogin(data.email, data.password);

      if (loginRes?.token && loginRes?.user) {
        setAuth({
          token: loginRes.token,
          user: loginRes.user
        });
        navigate('/investor/dashboard');  // redirect on success
      } else {
        // Stay on the page, maybe show an error message
        setApiError({ error: 'Login failed: Invalid response' });
      }

    } catch (err) {
      console.error('Registration error:', err);
      setApiError({
        error: err.message || 'Registration failed',
        details: err.details,
        resolution: err.resolution
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <main className="container">
        <div className="card">
          <h2>Create Account</h2>

          {/* progress */}
          <div className="progress">
            {steps.map((lbl,i) => (
              <div key={i} className={`dot ${i<=step?'active':''}`}>
                <span>{i+1}</span>
                <small>{lbl}</small>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} noValidate>
            {/* Step 1 */}
            <div className={`step-panel ${step===0?'show':''}`}>
              <div className="field">
                <label>Full Name</label>
                <input
                  name="full_name" type="text"
                  value={data.full_name}
                  onChange={handleChange}
                />
                {errors.full_name && <p className="error">{errors.full_name}</p>}
              </div>
              <div className="field">
                <label>Date of Birth</label>
                <input
                  name="dob" type="date"
                  value={data.dob}
                  onChange={handleChange}
                />
                {errors.dob && <p className="error">{errors.dob}</p>}
              </div>
              <div className="field radio-group">
                {['male','female','other'].map(g => (
                  <label key={g}>
                    <input
                      type="radio" name="gender" value={g}
                      checked={data.gender===g}
                      onChange={handleChange}
                    />
                    {g.charAt(0).toUpperCase()+g.slice(1)}
                  </label>
                ))}
                {errors.gender && <p className="error">{errors.gender}</p>}
              </div>
            </div>

            {/* Step 2 */}
            <div className={`step-panel ${step===1?'show':''}`}>
              <div className="field">
                <label>Email</label>
                <input
                  name="email" type="email"
                  value={data.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  name="phone" type="text"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
            </div>

            {/* Step 3 */}
            <div className={`step-panel ${step===2?'show':''}`}>
              <div className="field">
                <label>Street Address</label>
                <input
                  name="address" type="text"
                  value={data.address}
                  onChange={handleChange}
                />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
              <div className="grid-2">
                <div className="field">
                  <label>City</label>
                  <input
                    name="city" type="text"
                    value={data.city}
                    onChange={handleChange}
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                </div>
                <div className="field">
                  <label>State/Province</label>
                  <input
                    name="state" type="text"
                    value={data.state}
                    onChange={handleChange}
                  />
                  {errors.state && <p className="error">{errors.state}</p>}
                </div>
              </div>
              <div className="grid-2">
                <div className="field">
                  <label>Zip Code</label>
                  <input
                    name="zip" type="text"
                    value={data.zip}
                    onChange={handleChange}
                  />
                  {errors.zip && <p className="error">{errors.zip}</p>}
                </div>
                <div className="field">
                  <label>Country</label>
                  <input
                    name="country" type="text"
                    value={data.country}
                    onChange={handleChange}
                  />
                  {errors.country && <p className="error">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`step-panel ${step===3?'show':''}`}>
              <div className="field">
                <label>Password</label>
                <div className="pass-wrapper">
                  <input
                    name="password"
                    type={data.showPw?'text':'password'}
                    value={data.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button" className="toggle"
                    onClick={()=>setData(d=>({...d,showPw:!d.showPw}))}
                  >
                    {data.showPw?'Hide':'Show'}
                  </button>
                </div>
                <div className="strength">
                  <div style={{width:`${(strengthScore(data.password)/4)*100}%`}}/>
                </div>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword" type="password"
                  value={data.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </div>
              <div className="field checkbox">
                <label>
                  <input
                    name="terms" type="checkbox"
                    checked={data.terms}
                    onChange={handleChange}
                  /> I agree to Terms &amp; Conditions
                </label>
                {errors.terms && <p className="error">{errors.terms}</p>}
              </div>
            </div>

            {/* Step 5 */}
            <div className={`step-panel ${step===4?'show review':''}`}>
              <h4>Review</h4>
              <pre>{JSON.stringify(data,null,2)}</pre>
            </div>

            {/* API Feedback */}
            {apiError && (
              <div className="error-notice">
                <p><strong>{apiError.error}</strong></p>
                {apiError.details && (
                  <ul>{apiError.details.map((d,i)=><li key={i}>{d}</li>)}</ul>
                )}
                {apiError.resolution && <p><em>{apiError.resolution}</em></p>}
              </div>
            )}
            {successMsg && (
              <div className="success-notice">{successMsg}</div>
            )}

            {/* Buttons */}
            <div className="buttons">
              {step>0 && <button type="button" onClick={back}>Back</button>}
              {step<steps.length-1 && (
                <button type="button" onClick={next}>Next</button>
              )}
              {step===steps.length-1 && (
                <button type="submit" disabled={loading}>
                  {loading?'Submitting…':'Submit'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
