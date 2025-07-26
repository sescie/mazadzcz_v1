// src/components/FloatingAlert.jsx
import React from 'react';
import '../styles/FloatingAlert.css';

export default function FloatingAlert({ message }) {
  return (
    <div className="floating-alert">
      {message}
    </div>
  );
}
