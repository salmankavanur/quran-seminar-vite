import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="section-container py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-seminar-gold">Register</span>{' '}
            <span className="text-seminar-blue dark:text-white">for the Seminar</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join us for the National Seminar on Numerical Inimitability in the Holy Quran. 
            Complete the form below to secure your participation.
          </p>
          
          <div className="max-w-md mx-auto">
            <RegistrationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
