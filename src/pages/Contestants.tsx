import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContestantGrid from '../components/ContestantGrid';
import { ContactSection } from '../components/ContactSection';

const Contestants = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="section-container py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-seminar-blue dark:text-seminar-gold">Seminar</span>{' '}
            <span>Contestants</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet our distinguished participants who will be presenting their research on numerical inimitability in the Holy Quran.
          </p>
          <ContestantGrid />
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contestants;
