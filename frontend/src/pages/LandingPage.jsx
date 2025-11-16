import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import SystemOverview from '../components/landing/SystemOverview';
import Footer from '../components/landing/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <SystemOverview />
      <Footer />
    </div>
  );
}

export default LandingPage;