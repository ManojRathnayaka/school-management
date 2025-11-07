import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, School, LogIn } from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "hero" },
    { name: "Features", to: "features" },
    { name: "System Overview", to: "system-overview" },
    { name: "Contact", to: "footer" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass bg-white/70 backdrop-blur-lg shadow-lg"
          : "bg-white/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <ScrollLink
              to="hero"
              smooth={true}
              duration={500}
              className="flex items-center gap-2 text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            >
              <School />
              <span>School</span>
            </ScrollLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                offset={-64}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors"
                activeClass="text-blue-600"
                spy={true}
              >
                {link.name}
              </ScrollLink>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="btn btn-primary text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass bg-white/90 backdrop-blur-lg border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col items-center">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                offset={-64}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-colors px-3 py-2 rounded-lg text-center"
                activeClass="text-blue-600 bg-blue-50"
                spy={true}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </ScrollLink>
            ))}
            <Link
              to="/login"
              className="btn btn-primary text-white font-semibold py-2 px-6 rounded-lg mt-3 inline-flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;