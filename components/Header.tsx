
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserIcon } from './icons/UserIcon';
import { useData } from '../hooks/useMockData';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  const activeLinkClass = "bg-gray-700 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-800 hover:text-white";
  const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`;

  const baseLinks = [
    { to: "/", text: "Home" },
    { to: "/pronostiek", text: "Pronostiek" },
    { to: "/results", text: "Results" },
    { to: "/ranking", text: "Ranking" },
    { to: "/rules", text: "Rules" },
  ];

  const adminLinks = [
    { to: "/riders", text: "Riders" },
    { to: "/admin", text: "Admin" },
  ];

  const navLinks = currentUser?.isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-yellow-400">
              Belga<span className="text-white">Cycling</span>
            </NavLink>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
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
          
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
                <>
                    <NavLink to="/user" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                        <UserIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">{currentUser.username}</span>
                        {currentUser.isAdmin && <span className="ml-2 bg-red-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-black">Admin</span>}
                    </NavLink>
                    <button 
                        onClick={handleLogout}
                        className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <NavLink to="/login" className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-400">
                    Sign In
                </NavLink>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800 border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
             <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              {link.text}
            </NavLink>
          ))}
          {currentUser ? (
              <>
                <NavLink to="/user" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-yellow-400 font-bold">Profile ({currentUser.username})</NavLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-400">Logout</button>
              </>
          ) : (
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-yellow-400 font-bold">Sign In</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
