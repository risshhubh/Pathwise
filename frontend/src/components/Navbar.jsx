import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  UserCircle, 
  ChevronDown, 
  HelpCircle, 
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateAuthState = () => {
      setLoggedIn(!!localStorage.getItem("token"));
    };
    updateAuthState();
    window.addEventListener("storage", updateAuthState);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setDropdown(false);
    navigate("/auth");
  };

  const navLinks = [
    { name: "Home", icon: <Home size={18} />, to: "/" },
    { name: "Interview", icon: <Users size={18} />, to: "/interview" },
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
    { name: "About", icon: <BookOpen size={18} />, to: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/30 border-b border-gray-700">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Pathwise
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link to={link.to} className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition-colors">
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
          {loggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
                aria-label="Profile menu"
              >
                <UserCircle size={20} />
                <ChevronDown size={16} className={`transition-transform ${dropdown ? 'rotate-180' : ''}`} />
              </button>
              {dropdown && (
                 <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 flex flex-col">
                 <button
                  onClick={() => { setDropdown(false); navigate('/profile'); }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 rounded-t-lg flex items-start gap-3"
                >
                  <UserCircle size={18} className="mt-1 text-gray-400" />
                  <div>
                    <div className="font-semibold">Profile</div>
                    <div className="text-xs text-gray-400">View your interview history</div>
                  </div>
                </button>
                <button
                  onClick={() => { setDropdown(false); navigate('/help'); }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 flex items-start gap-3 border-t border-gray-700"
                >
                  <HelpCircle size={18} className="mt-1 text-gray-400" />
                  <div>
                    <div className="font-semibold">Help & Support</div>
                    <div className="text-xs text-gray-400">FAQs and documentation</div>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 rounded-b-lg flex items-start gap-3 border-t border-gray-700"
                >
                  <LogOut size={18} className="mt-1 text-gray-400" />
                   <div>
                    <div className="font-semibold">Logout</div>
                    <div className="text-xs text-gray-400">Sign out of your account</div>
                  </div>
                </button>
              </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <button className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* NEW: Mobile Icon Bar - Visible only on mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex md:hidden items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.to} className="text-gray-300 hover:text-white transition-colors p-2" aria-label={link.name}>
              {React.cloneElement(link.icon, { size: 24 })}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu (now for account actions) */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-72 bg-gray-900 shadow-lg z-50 transition-transform duration-300 transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Account
              </span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* The main nav links are removed from here */}
            <div className="flex-1 flex flex-col justify-end p-4">
              {loggedIn ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-blue-400"><UserCircle size={18} /></span>
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors w-full"
                  >
                    <span className="text-blue-400"><LogOut size={18} /></span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}