import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SeminarDetailsSection from '../components/SeminarDetailsSection';
import { ContactSection } from '../components/ContactSection';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PosterSection from '../components/PosterSection';
import ContestantGrid from '../components/ContestantGrid';
import AboutSection from '../components/About';

const Index = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SeminarDetailsSection />
        
        {/* Show contestants section */}
        <section className="bg-muted/30 py-16">
          <div className="section-container">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-seminar-gold">Meet our</span>{' '}
                <span className="text-seminar-blue dark:text-white">Distinguished Contestants</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Learn about the scholars and researchers presenting their work on numerical inimitability in the Holy Quran.
              </p>
              <Link to="/contestants">
                <Button className="mb-10">View All Contestants</Button>
              </Link>
            </div>
            <ContestantGrid />
          </div>
        </section>
        
        {/* Show posters section */}
        <PosterSection />
        
        {/* Show admin panel link only for admins */}
        {isAdmin && (
          <div className="section-container py-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Access Admin Panel
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Manage contestants, posters, registrations, and settings through the admin dashboard.
              </p>
              <Link to="/admin">
                <Button size="lg" className="gap-2">
                  Go to Admin Panel <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
        <AboutSection/>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
