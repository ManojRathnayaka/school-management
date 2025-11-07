import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { MapPin, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <section id="footer" className="bg-base-200 text-base-content">
      <footer className="footer max-w-7xl mx-auto p-10 lg:justify-around">
        <nav>
          <header className="footer-title">Mahamaya Girls' College</header>
          <div className="space-y-3">
            <a className="link link-hover flex items-center gap-3">
              <MapPin size={16} className="text-primary" />
              <span>Kandy, Sri Lanka</span>
            </a>
            <a
              className="link link-hover flex items-center gap-3"
              href="mailto:mahamayagckandy@gmail.com"
            >
              <Mail size={16} className="text-primary" />
              <span>mahamayagckandy@gmail.com</span>
            </a>
            <a
              className="link link-hover flex items-center gap-3"
              href="tel:+94812223961"
            >
              <Phone size={16} className="text-primary" />
              <span>+94 81 222 3961</span>
            </a>
          </div>
        </nav>

        <nav>
          <header className="footer-title">Quick Links</header>
          <div className="flex flex-col space-y-2">
            <ScrollLink
              to="hero"
              smooth={true}
              duration={500}
              className="link link-hover cursor-pointer"
            >
              Home
            </ScrollLink>
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              className="link link-hover cursor-pointer"
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="system-overview"
              smooth={true}
              duration={500}
              className="link link-hover cursor-pointer"
            >
              System Overview
            </ScrollLink>
          </div>
        </nav>

        <nav>
          <header className="footer-title">Social</header>
          <div className="space-y-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-3"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Facebook</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-3"
              aria-label="YouTube"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M21.543 6.498C22 7.6 22 12 22 12s0 4.4-.457 5.502c-.254.612-.67 1.15-1.18 1.45a27.03 27.03 0 0 1-8.363.448c-3.07-.006-6.09-.15-8.363-.448-.51-.3-.926-.838-1.18-1.45C2 16.4 2 12 2 12s0-4.4.457-5.502c.254-.612.67-1.15 1.18-1.45a27.03 27.03 0 0 1 8.363-.448c3.07.006 6.09.15 8.363.448.51.3.926.838 1.18 1.45zM10 15.5l6-3.5-6-3.5v7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>YouTube</span>
            </a>
          </div>
        </nav>
      </footer>

      <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300">
        <aside>
          <p>© 2025 Mahamaya Girls' College. All rights reserved.</p>
        </aside>
      </footer>
    </section>
  );
}

export default Footer;