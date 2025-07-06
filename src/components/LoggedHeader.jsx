import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  FaUser, 
  FaUserEdit, 
  FaUserTie, 
  FaUserShield, 
  FaUserCog, 
  FaBars, 
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import './styles/Header.css';
import { useNavigate } from 'react-router-dom';
import { ContextProviderDeclare } from '../store/ContextProvider';

const LoggedHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {setToken} = useContext(ContextProviderDeclare);

  const roles = [
    { 
      name: 'Author', 
      icon: <FaUser />, 
      link: 'https://computer-jagat-author.vercel.app/',
      description: 'Submit and track your manuscripts',
      color: '#3498db'
    },
    { 
      name: 'Reviewer', 
      icon: <FaUserEdit />, 
      link: 'https://computer-jagat-reviewer.vercel.app/',
      description: 'Review submitted manuscripts',
      color: '#2ecc71'
    },
    { 
      name: 'Associate Editor', 
      icon: <FaUserTie />, 
      link: 'https://computer-jagat-associate-editor.vercel.app/',
      description: 'Manage the review process',
      color: '#9b59b6'
    },
    { 
      name: 'Area Editor', 
      icon: <FaUserShield />, 
      link: 'https://computer-jagat-area-editor.vercel.app/',
      description: 'Oversee specific subject areas',
      color: '#e67e22'
    },
    { 
      name: 'Editor in Chief', 
      icon: <FaUserCog />, 
      link: 'https://computer-jagat-chief-editor.vercel.app/',
      description: 'Manage the entire editorial process',
      color: '#e74c3c'
    }
  ];

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  const toggleDropdown = (roleName) => {
    setActiveDropdown(activeDropdown === roleName ? null : roleName);
  };

  /*const handleLogout = async() => {
    localStorage.removeItem('jwtToken'); // Clear current domain token (5178)

    const portals = [
      'https://computer-jagat-author.vercel.app',
      'https://computer-jagat-reviewer.vercel.app',
      'https://computer-jagat-associate-editor.vercel.app',
      'https://computer-jagat-area-editor.vercel.app',
      'https://computer-jagat-chief-editor.vercel.app'
    ];

    // Inject hidden iframes to trigger logout on each portal
    portals.forEach((portal) => {
      const iframe = document.createElement('iframe');
      iframe.src = `${portal}?logout=true&timestamp=${Date.now()}`; // Add timestamp to avoid caching
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    });

    // Allow iframes to execute logout code, then redirect
    setTimeout(() => {
      window.location.href = 'https://journal-management-system-frontend.vercel.app/login';
    }, 1500);
  };*/

  const handleLogout = () => {
    // 1. Clear current domain's token immediately
    localStorage.removeItem('jwtToken');
    
    // 2. List all your portal domains
    const portals = [
      'https://computer-jagat-author.vercel.app',
      'https://computer-jagat-reviewer.vercel.app',
      'https://computer-jagat-associate-editor.vercel.app',
      'https://computer-jagat-area-editor.vercel.app',
      'https://computer-jagat-chief-editor.vercel.app'
    ];

    // 3. Use window.open() instead of iframes (better cross-domain support)
    portals.forEach(domain => {
      const win = window.open(`${domain}?logout=true&timestamp=${Date.now()}`, '_blank', 'noopener,noreferrer');
      
      // Close the window after a short delay
      setTimeout(() => {
        if (win && !win.closed) {
          win.close();
        }
      }, 1000);
    });

    // 4. Redirect to login page
    window.location.href = 'https://journal-management-system-frontend.vercel.app/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="journal-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="Journal Management System Logo" 
              className="logo-image"
              onClick={() => navigate('/')}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" ref={dropdownRef}>
          {roles.map((role) => (
            <div 
              key={role.name} 
              className={`nav-item ${activeDropdown === role.name ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown(role.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div 
                className="nav-button"
                onClick={() => toggleDropdown(role.name)}
                style={{ '--role-color': role.color }}
              >
                <span className="button-icon">{role.icon}</span>
                <span className="button-text">{role.name}</span>
                <span className="dropdown-arrow">
                  {activeDropdown === role.name ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              
              {activeDropdown === role.name && (
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="role-header" style={{ backgroundColor: role.color }}>
                      <span className="button-icon">{role.icon}</span>
                      <span className="role-title">{role.name}</span>
                    </div>
                    <p className="role-description">{role.description}</p>
                    <button 
                      className="portal-button"
                      onClick={() => openLink(role.link)}
                      style={{ backgroundColor: role.color }}
                    >
                      Go to {role.name} Portal
                      <FaExternalLinkAlt className="external-icon" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Logout Button */}
          <div className="auth-buttons">
            <button 
              className="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FaSignOutAlt className="button-icon" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {roles.map((role) => (
            <div key={role.name} className="mobile-nav-item">
              <button
                className="mobile-nav-button"
                onClick={() => {
                  openLink(role.link);
                  setIsMobileMenuOpen(false);
                }}
                aria-label={`Open ${role.name} portal`}
                style={{ borderLeft: `4px solid ${role.color}` }}
              >
                <span className="button-icon" style={{ color: role.color }}>{role.icon}</span>
                <div className="mobile-button-text">
                  <span className="role-name">{role.name}</span>
                  <span className="role-description">{role.description}</span>
                </div>
                <FaExternalLinkAlt className="external-icon" />
              </button>
            </div>
          ))}

          {/* Mobile Logout Button */}
          <div className="mobile-auth-buttons">
            <button
              className="mobile-logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FaSignOutAlt className="button-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LoggedHeader;