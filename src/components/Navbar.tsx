
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarUserMenu from './NavbarUserMenu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Details', path: '#seminar-details' },
    { title: 'Contestants', path: '/contestants' },
    { title: 'Register', path: '/register' },
    { title: 'Contact', path: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-lg md:text-xl font-semibold tracking-tight no-underline">
              <span className="text-seminar-gold">Numerical</span>{' '}
              <span className="text-seminar-blue dark:text-white">Inimitability</span>
            </Link>
            <p className='text-muted-foreground text-sm '>National Quranic Seminar</p>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-seminar-gold transition-colors">
              Home
            </Link>
            <Link to="#seminar-details" className="text-sm font-medium hover:text-seminar-gold transition-colors">
              Details
            </Link>
            <Link to="/contestants" className="text-sm font-medium hover:text-seminar-gold transition-colors">
              Contestants
            </Link>
            <Link to="/register" className="text-sm font-medium hover:text-seminar-gold transition-colors">
              Register
            </Link>
            <Link to="#contact" className="text-sm font-medium hover:text-seminar-gold transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            
            {/* User Menu */}
            <NavbarUserMenu />
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <div className="flex flex-col gap-4 px-2 py-6">
                  <Link to="/" className="px-2 py-1 text-lg font-semibold">
                    <span className="text-seminar-gold">Numerical</span>{' '}
                    <span className="text-seminar-blue dark:text-white">Inimitability</span>
                  </Link>
                  <nav className="flex flex-col gap-3">
                    {menuItems.map((item) => (
                      <Link 
                        key={item.title}
                        to={item.path} 
                        className="px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
