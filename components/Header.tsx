
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserIcon } from './icons/UserIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeLinkClass = "bg-gray-700 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-800 hover:text-white";

  const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`;

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/pronostiek", text: "Pronostiek" },
    { to: "/results", text: "Results" },
    { to: "/ranking", text: "Ranking" },
    { to: "/rules", text: "Rules" },
    { to: "/riders", text: "Riders" },
    { to: "/admin", text: "Admin" },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-yellow-400">
              Belga<span className="text-white">Cycling</span>
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                   <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                  >
                    {link.text}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <NavLink to="/user" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
              <UserIcon className="h-6 w-6 mr-2" />
              My Profile
            </NavLink>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
             <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              {link.text}
            </NavLink>
          ))}
           <NavLink to="/user" className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
              My Profile
            </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
