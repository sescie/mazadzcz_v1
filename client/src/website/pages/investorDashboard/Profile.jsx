// src/pages/ManageProfile.js
import React, { useEffect, useState } from 'react';
import {
  getUserProfile,
  updateUserInfo,
  updateEmail,
  updatePassword,
  updateBanking
} from '../../../services/profileApi';
import Layout from '../layouts/InvestorLayout';
import '../../styles/ManageProfile.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_branch: '',
    swift_bic: '',
    preferred_payout_method: '',
    date_of_birth: '',
    nationality: '',
    residential_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getUserProfile();
      setProfile(data);
      setForm((prev) => ({
        ...prev,
        ...data
      }));
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async () => {
    try {
      await updateUserInfo(form);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(form.email);
      setMessage('Email updated');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update email');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setForm({ ...form, currentPassword: '', newPassword: '' });
      setMessage('Password updated');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update password');
    }
  };

  const handleUpdateBanking = async () => {
    try {
      await updateBanking(form);
      setMessage('Banking details updated');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update banking details');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <Layout>
      <div className="manage-profile">
        <h2>Manage Profile</h2>
        {message && <p className="message">{message}</p>}

        {/* GENERAL INFO */}
        <div className="card">
          <h3>General Info</h3>
          {[
            ['Full Name', 'full_name'],
            ['Phone', 'phone'],
            ['Date of Birth', 'date_of_birth'],
            ['Nationality', 'nationality'],
            ['Residential Address', 'residential_address'],
            ['City', 'city'],
            ['State', 'state'],
            ['Postal Code', 'postal_code'],
            ['Country', 'country']
          ].map(([label, name]) => (
            <div className="form-group" key={name}>
              <div className="form-label">{label}</div>
              <input className='profile-input'
                id={name}
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                placeholder={label}
              />
            </div>
          ))}
          <button  className='profile-button' onClick={handleUpdateInfo}>Update Info</button>
        </div>

        {/* EMAIL */}
        <div className="card">
          <h3>Email</h3>
          <div className="form-group">
            <div className="form-label" htmlFor="email">Email</div>
            <input className='profile-input'
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
            />
          </div>
          <button className='profile-button' onClick={handleUpdateEmail}>Update Email</button>
        </div>

        {/* PASSWORD */}
        <div className="card">
          <h3>Password</h3>
          <div className="form-group">
            <div className="form-label">Current Password</div>
            <input className='profile-input'
              name="currentPassword"
              id="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
            />
          </div>
          <div className="form-group">
            <div className="form-label" htmlFor="newPassword">New Password</div>
            <input className='profile-input'
              name="newPassword"
              id="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
          </div>
          <button  className='profile-button' onClick={handleUpdatePassword}>Update Password</button>
        </div>

        {/* BANKING */}
        <div className="card">
          <h3>Banking Details</h3>
          {[
            ['Bank Name', 'bank_name'],
            ['Account Name', 'bank_account_name'],
            ['Account Number', 'bank_account_number'],
            ['Branch', 'bank_branch'],
            ['SWIFT / BIC', 'swift_bic'],
            ['Preferred Payout Method', 'preferred_payout_method']
          ].map(([label, name]) => (
            <div className="form-group" key={name}>
              <div className="form-label" htmlFor={name}>{label}</div>
              <input className='profile-input'
                id={name}
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                placeholder={label}
              />
            </div>
          ))}
          <button  className='profile-button' onClick={handleUpdateBanking}>Update Banking</button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
