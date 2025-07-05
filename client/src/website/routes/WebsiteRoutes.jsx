import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage    from '../pages/HomePage';
import AboutPage   from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFound    from '../pages/NotFoundPage';
import HowToInvest   from '../pages/HowToInvest';
import Investments from '../pages/Investments';
export default function WebsiteRoutes() {
  return (
    <Routes>
      <Route index       element={<HomePage />} />
      <Route path="about"   element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="how-to-invest" element={<HowToInvest />} />
      <Route path="investments" element={<Investments />} />
      {/* Catch-all route for 404 Not Found */}
      <Route path="*"       element={<NotFound />} />
    </Routes>
  );
}
