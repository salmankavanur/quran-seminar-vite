import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              <span className="text-seminar-gold">Numerical</span>{' '}
              <span className="text-seminar-blue dark:text-white">Inimitability</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              Exploring the mathematical miracles and numerical patterns in the Holy Quran through academic research and collaboration.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">Home</Link>
              <Link to="/contestants" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">Contestants</Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">Register</Link>
            </nav>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Organiazing by</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">UNIVERSITY OF CALICUT</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">SA'ADA STUDENTS' UNION</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-seminar-gold transition-colors">AKODE ISLAMIC CENTRE</a>
            </nav>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Our Partners</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-full border-2 border-seminar-gold overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="/images/center-logo.webp" 
                  alt="UNIVERSITY OF CALICUT" 
                  className="w-full h-full object-contain "
                />
              </div>
              <div className="aspect-square bg-white dark:bg-white rounded-full border-2 border-seminar-gold overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="/images/university-logo.png" 
                  alt="SA'ADA STUDENTS' UNION" 
                  className="w-full h-full object-contain "
                />
              </div>
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-full border-2 border-seminar-gold overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="/images/union-logo.jpg" 
                  alt="AKODE ISLAMIC CENTRE" 
                  className="w-full h-full object-contain "
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} National Quranic Seminar on Numerical Inimitability. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-seminar-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-seminar-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;