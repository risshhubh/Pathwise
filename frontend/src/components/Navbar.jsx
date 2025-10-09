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
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hover:scale-105 transition-transform"
          >
            Pathwise
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="group relative px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-3/4"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Account Section */}
          <div className="hidden lg:flex items-center">
            {loggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown((prev) => !prev)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
                  aria-label="Profile menu"
                >
                  <UserCircle size={20} />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {dropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                    <button
                      onClick={() => { setDropdown(false); navigate('/profile'); }}
                      className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <UserCircle size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-100">Profile</div>
                        <div className="text-xs text-gray-400 mt-0.5">View your interview history</div>
                      </div>
                    </button>
                    <div className="h-px bg-white/10"></div>
                    <button
                      onClick={() => { setDropdown(false); navigate('/help'); }}
                      className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                        <HelpCircle size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-100">Help & Support</div>
                        <div className="text-xs text-gray-400 mt-0.5">FAQs and documentation</div>
                      </div>
                    </button>
                    <div className="h-px bg-white/10"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#2a0000] transition-colors flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                        <LogOut size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-100">Logout</div>
                        <div className="text-xs text-gray-400 mt-0.5">Sign out of your account</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Icons */}
          <div className="flex lg:hidden items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.to} 
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 p-2" 
                aria-label={link.name}
              >
                {React.cloneElement(link.icon, { size: 22 })}
              </Link>
            ))}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-sm transition-all duration-300 ml-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Account Menu */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#0d0d0d] border-l border-white/10 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Account
              </span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Account actions */}
            <div className="flex-1 flex flex-col p-6 gap-2">
              {loggedIn ? (
                <>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/profile'); }}
                    className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group rounded-xl"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <UserCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-100">Profile</div>
                      <div className="text-xs text-gray-400 mt-0.5">View your interview history</div>
                    </div>
                  </button>
                  <div className="h-px bg-white/10"></div>

                  <button
                    onClick={() => { setIsOpen(false); navigate('/help'); }}
                    className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group rounded-xl"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <HelpCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-100">Help & Support</div>
                      <div className="text-xs text-gray-400 mt-0.5">FAQs and documentation</div>
                    </div>
                  </button>
                  <div className="h-px bg-white/10"></div>

                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#2a0000] transition-colors flex items-start gap-3 group rounded-xl"
                  >
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                      <LogOut size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-100">Logout</div>
                      <div className="text-xs text-gray-400 mt-0.5">Sign out of your account</div>
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
