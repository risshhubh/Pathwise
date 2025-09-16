import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import ParallaxPage from '../components/ParallaxPage';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <ParallaxPage />
    </>
  );
}