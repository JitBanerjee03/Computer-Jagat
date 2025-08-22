/*import React, { useState, useRef, useEffect, useContext } from 'react';
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

  //const handleLogout = async() => {
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
  };//

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
    window.location.href = 'https://computer-jagat.vercel.app/login';
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

        <button 
          className="mobile-menu-button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

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

export default LoggedHeader;*/

/*import React, { useState, useRef, useEffect, useContext } from 'react';
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
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { setToken } = useContext(ContextProviderDeclare);

  // All possible roles with their configurations
  const allRoles = {
    author: { 
      name: 'Author', 
      icon: <FaUser />, 
      description: 'Submit and track your manuscripts',
      color: '#3498db',
      getUrl: (token) => `https://computer-jagat-author.vercel.app/?token=${encodeURIComponent(token)}`
    },
    reviewer: { 
      name: 'Reviewer', 
      icon: <FaUserEdit />, 
      description: 'Review submitted manuscripts',
      color: '#2ecc71',
      getUrl: (token) => `https://computer-jagat-reviewer.vercel.app/?token=${encodeURIComponent(token)}`
    },
    associate_editor: { 
      name: 'Associate Editor', 
      icon: <FaUserTie />, 
      description: 'Manage the review process',
      color: '#9b59b6',
      getUrl: (token) => `https://computer-jagat-associate-editor.vercel.app/?token=${encodeURIComponent(token)}`
    },
    area_editor: { 
      name: 'Area Editor', 
      icon: <FaUserShield />, 
      description: 'Oversee specific subject areas',
      color: '#e67e22',
      getUrl: (token) => `https://computer-jagat-area-editor.vercel.app/?token=${encodeURIComponent(token)}`
    },
    eic: { 
      name: 'Editor in Chief', 
      icon: <FaUserCog />, 
      description: 'Manage the entire editorial process',
      color: '#e74c3c',
      getUrl: (token) => `https://computer-jagat-chief-editor.vercel.app/?token=${encodeURIComponent(token)}`
    }
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const data = await response.json();
        
        // Determine which roles the user has
        const userRoles = [];
        if (data.eic_id) userRoles.push('eic');
        if (data.area_editor_id) userRoles.push('area_editor');
        if (data.associate_editor_id) userRoles.push('associate_editor');
        if (data.reviewer_id) userRoles.push('reviewer');
        if (data.id) userRoles.push('author');

        // Create the available roles array with full role information
        const rolesToDisplay = userRoles.map(roleId => ({
          id: roleId,
          name: allRoles[roleId].name,
          icon: allRoles[roleId].icon,
          description: allRoles[roleId].description,
          color: allRoles[roleId].color,
          url: allRoles[roleId].getUrl(token)
        }));

        setAvailableRoles(rolesToDisplay);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        // Handle error (e.g., redirect to login if token is invalid)
        localStorage.removeItem('jwtToken');
        setToken(null);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [navigate, setToken]);

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  const toggleDropdown = (roleName) => {
    setActiveDropdown(activeDropdown === roleName ? null : roleName);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    
    const portals = [
      'https://computer-jagat-author.vercel.app',
      'https://computer-jagat-reviewer.vercel.app',
      'https://computer-jagat-associate-editor.vercel.app',
      'https://computer-jagat-area-editor.vercel.app',
      'https://computer-jagat-chief-editor.vercel.app'
    ];

    portals.forEach(domain => {
      const win = window.open(`${domain}?logout=true&timestamp=${Date.now()}`, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        if (win && !win.closed) {
          win.close();
        }
      }, 1000);
    });

    window.location.href = 'https://computer-jagat.vercel.app/login';
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

  if (isLoading) {
    return (
      <header className="journal-header">
        <div className="header-container">
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
          <div className="loading-message">Loading user roles...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="journal-header">
      <div className="header-container">
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

        {availableRoles.length > 0 && (
          <nav className="desktop-nav" ref={dropdownRef}>
            {availableRoles.map((role) => (
              <div 
                key={role.id} 
                className={`nav-item ${activeDropdown === role.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveDropdown(role.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div 
                  className="nav-button"
                  onClick={() => toggleDropdown(role.id)}
                  style={{ '--role-color': role.color }}
                >
                  <span className="button-icon">{role.icon}</span>
                  <span className="button-text">{role.name}</span>
                  <span className="dropdown-arrow">
                    {activeDropdown === role.id ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {activeDropdown === role.id && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <div className="role-header" style={{ backgroundColor: role.color }}>
                        <span className="button-icon">{role.icon}</span>
                        <span className="role-title">{role.name}</span>
                      </div>
                      <p className="role-description">{role.description}</p>
                      <button 
                        className="portal-button"
                        onClick={() => openLink(role.url)}
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
        )}

        <button 
          className="mobile-menu-button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMobileMenuOpen && availableRoles.length > 0 && (
        <div className="mobile-nav">
          {availableRoles.map((role) => (
            <div key={role.id} className="mobile-nav-item">
              <button
                className="mobile-nav-button"
                onClick={() => {
                  openLink(role.url);
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

export default LoggedHeader;*/

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
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { setToken } = useContext(ContextProviderDeclare);

  const allRoles = {
    author: { name: 'Author', icon: <FaUser />, description: 'Submit and track your manuscripts', color: '#3498db', portal: 'https://computer-jagat-author.vercel.app' },
    reviewer: { name: 'Reviewer', icon: <FaUserEdit />, description: 'Review submitted manuscripts', color: '#2ecc71', portal: 'https://computer-jagat-reviewer.vercel.app' },
    associate_editor: { name: 'Associate Editor', icon: <FaUserTie />, description: 'Manage the review process', color: '#9b59b6', portal: 'https://computer-jagat-associate-editor.vercel.app' },
    area_editor: { name: 'Area Editor', icon: <FaUserShield />, description: 'Oversee specific subject areas', color: '#e67e22', portal: 'https://computer-jagat-area-editor.vercel.app' },
    eic: { name: 'Editor in Chief', icon: <FaUserCog />, description: 'Manage the entire editorial process', color: '#e74c3c', portal: 'https://computer-jagat-chief-editor.vercel.app' },
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) { 
        setIsLoading(false); 
        return; 
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Token validation failed');
        const data = await res.json();

        const userRoles = [];
        if (data.eic_id) userRoles.push('eic');
        if (data.area_editor_id) userRoles.push('area_editor');
        if (data.associate_editor_id) userRoles.push('associate_editor');
        if (data.reviewer_id) userRoles.push('reviewer');
        if (data.id) userRoles.push('author');

        setAvailableRoles(userRoles.map(roleId => ({
          id: roleId,
          ...allRoles[roleId],
          url: `${allRoles[roleId].portal}?token=${encodeURIComponent(token)}`
        })));
      } catch (err) {
        console.error('Error fetching roles:', err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const toggleDropdown = (roleId) => {
    setActiveDropdown(activeDropdown === roleId ? null : roleId);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);

    const portals = Object.values(allRoles).map(role => role.portal);
    portals.forEach(domain => {
      const win = window.open(`${domain}?logout=true&timestamp=${Date.now()}`, '_blank', 'noopener,noreferrer');
      setTimeout(() => win?.close(), 1000);
    });

    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) return (
    <header className="journal-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" className="logo-image" onClick={() => navigate('/')} />
        </div>
        <div className="loading-message">Loading user roles...</div>
      </div>
    </header>
  );

  return (
    <header className="journal-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" className="logo-image" onClick={() => navigate('/')} />
        </div>

        {availableRoles.length > 0 && (
          <nav className="desktop-nav" ref={dropdownRef}>
            {availableRoles.map(role => (
              <div key={role.id} className={`nav-item ${activeDropdown === role.id ? 'active' : ''}`}
                   onMouseEnter={() => setActiveDropdown(role.id)} onMouseLeave={() => setActiveDropdown(null)}>
                <div className="nav-button" onClick={() => toggleDropdown(role.id)} style={{ '--role-color': role.color }}>
                  <span className="button-icon">{role.icon}</span>
                  <span className="button-text">{role.name}</span>
                  <span className="dropdown-arrow">{activeDropdown === role.id ? <FaChevronUp /> : <FaChevronDown />}</span>
                </div>

                {activeDropdown === role.id && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <div className="role-header" style={{ backgroundColor: role.color }}>
                        <span className="button-icon">{role.icon}</span>
                        <span className="role-title">{role.name}</span>
                      </div>
                      <p className="role-description">{role.description}</p>
                      <button className="portal-button" onClick={() => window.open(role.url, '_blank')} style={{ backgroundColor: role.color }}>
                        Go to {role.name} Portal <FaExternalLinkAlt className="external-icon" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="auth-buttons">
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="button-icon" /> <span>Logout</span>
              </button>
            </div>
          </nav>
        )}

        <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMobileMenuOpen && availableRoles.length > 0 && (
        <div className="mobile-nav">
          {availableRoles.map(role => (
            <div key={role.id} className="mobile-nav-item">
              <button className="mobile-nav-button" onClick={() => window.open(role.url, '_blank')} style={{ borderLeft: `4px solid ${role.color}` }}>
                <span className="button-icon" style={{ color: role.color }}>{role.icon}</span>
                <div className="mobile-button-text">
                  <span className="role-name">{role.name}</span>
                  <span className="role-description">{role.description}</span>
                </div>
                <FaExternalLinkAlt className="external-icon" />
              </button>
            </div>
          ))}

          <div className="mobile-auth-buttons">
            <button className="mobile-logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="button-icon" /> <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LoggedHeader;

