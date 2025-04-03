
import React from 'react';
import CountdownTimer from './CountdownTimer';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0,rgba(26,54,93,0.05)_50%,rgba(26,54,93,0)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0,rgba(16,16,30,0.1)_100%)]"></div>
      
      <div className="section-container flex flex-col items-center text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            National Seminar on
            <span className="block text-seminar-blue dark:text-seminar-gold mt-2">
              Numerical Inimitability in the Holy Quran
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Evidence of Divine Precision through mathematical patterns and numerical structures,
            revealing the miraculous nature of the sacred text.
          </p>
          
          <div className="mb-12">
            <CountdownTimer />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-seminar-blue px-8 text-sm font-medium text-white shadow transition-colors hover:bg-seminar-blue/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Register Now
            </Link>
            <a href="#seminar-details" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      
    </section>
  );
};

export default HeroSection;
