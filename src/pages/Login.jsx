import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignInAlt, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaChevronRight,
  FaUser,
  FaUserEdit,
  FaUserTie,
  FaUserShield,
  FaUserCog
} from 'react-icons/fa';
import './styles/Login.css';
import { ContextProviderDeclare } from '../store/ContextProvider';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const {setToken} = useContext(ContextProviderDeclare);

  // Role icons mapping
  const roleIcons = {
    'author': <FaUser className="role-icon" />,
    'reviewer': <FaUserEdit className="role-icon" />,
    'associate_editor': <FaUserTie className="role-icon" />,
    'area_editor': <FaUserShield className="role-icon" />,
    'eic': <FaUserCog className="role-icon" />
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      validateTokenAndRedirect(token);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateTokenAndRedirect = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      const roles = [];
      
      if (data.eic_id) roles.push({ id: 'eic', name: 'Editor in Chief', url: `https://computer-jagat-chief-editor.vercel.app/?token=${encodeURIComponent(token)}` });
      if (data.area_editor_id) roles.push({ id: 'area_editor', name: 'Area Editor', url: `https://computer-jagat-area-editor.vercel.app/?token=${encodeURIComponent(token)}` });
      if (data.associate_editor_id) roles.push({ id: 'associate_editor', name: 'Associate Editor', url: `https://computer-jagat-associate-editor.vercel.app/?token=${encodeURIComponent(token)}` });
      if (data.reviewer_id) roles.push({ id: 'reviewer', name: 'Reviewer', url: `https://computer-jagat-reviewer.vercel.app/?token=${encodeURIComponent(token)}` });
      if (data.id) roles.push({ id: 'author', name: 'Author', url: `https://computer-jagat-author.vercel.app/?token=${encodeURIComponent(token)}` });

      if (roles.length === 0) {
        throw new Error('No valid roles found for this user');
      }

      setUserRoles(roles);
      
      if (roles.length === 1) {
        window.location.href = roles[0].url;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('jwtToken');
      setErrors({ form: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        alert('Invalid email or password. Please try again.');
        throw new Error(data.detail || 'Login failed. Please check your credentials.');
      }

      localStorage.setItem('jwtToken', data.token);
      console.log('Token stored in localStorage');
      
      const roles = [];
      if (data.eic_id) roles.push({ id: 'eic', name: 'Editor in Chief', url: `https://computer-jagat-chief-editor.vercel.app/?token=${encodeURIComponent(data.token)}` });
      if (data.area_editor_id) roles.push({ id: 'area_editor', name: 'Area Editor', url: `https://computer-jagat-area-editor.vercel.app/?token=${encodeURIComponent(data.token)}` });
      if (data.associate_editor_id) roles.push({ id: 'associate_editor', name: 'Associate Editor', url: `https://computer-jagat-associate-editor.vercel.app/?token=${encodeURIComponent(data.token)}` });
      if (data.reviewer_id) roles.push({ id: 'reviewer', name: 'Reviewer', url: `https://computer-jagat-reviewer.vercel.app/?token=${encodeURIComponent(data.token)}` });
      if (data.id) roles.push({ id: 'author', name: 'Author', url: `https://computer-jagat-author.vercel.app/?token=${encodeURIComponent(data.token)}` });

      if (roles.length === 0) {
        throw new Error('No valid roles found for this user');
      }

      setUserRoles(roles);
      
      if (roles.length === 1) {
        window.location.href = roles[0].url;
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setToken(localStorage.getItem('jwtToken'));
      setIsSubmitting(false);
      navigate('/');
    }
  };

  const handleRoleSelect = (role) => {
    console.log('Redirecting to:', role.url);
    setSelectedRole(role);
    window.location.href = role.url;
  };

  const handleLogout = () => {
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
    setToken(null);
    // Allow iframes to execute logout code, then redirect
    setTimeout(() => {
      window.location.href = 'https://journal-management-system-frontend.vercel.app/login';
    }, 1500);
  };

  if (userRoles.length > 1 && !selectedRole) {
    return (
      <div className="role-selector-container">
        <div className="role-selector-card">
          <div className="role-selector-header">
            <h2>Welcome to Journal Management System</h2>
            <p>You have access to multiple portals. Please select your role:</p>
          </div>
          
          <div className="role-grid">
            {userRoles.map(role => (
              <div 
                key={role.id} 
                className="role-card"
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-icon-container">
                  {roleIcons[role.id]}
                </div>
                <div className="role-info">
                  <h3>{role.name}</h3>
                  <p className="role-url">{role.url.replace('http://', '').replace('/', '').split('?')[0]}</p>
                </div>
                <FaChevronRight className="role-arrow" />
              </div>
            ))}
          </div>
          
          <div className="role-selector-footer">
            <button className="logout-btn" onClick={handleLogout}>
              Not you? Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-logo">
          <img src="/logo.png" alt="Journal Management System Logo" />
        </div>
        <div className="auth-content">
          <h1>Journal Management System</h1>
          <p className="auth-subtitle">Academic Publishing Platform</p>
          <p className="auth-description">
            A comprehensive platform for manuscript submission, peer review, 
            and editorial management for academic journals.
          </p>
        </div>
      </div>
      
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Sign In</h2>
            <p>Use your credentials to access the system</p>
          </div>

          {errors.form && (
            <div className="auth-form-error">
              <span className="error-icon">!</span>
              <span>{errors.form}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt /> Sign In
                  </>
                )}
              </button>
            </div>

            <div className="auth-form-footer">
              <p>
                Don't have an account?{' '}
                <a href="/register" className="auth-link">Create one</a>
              </p>
              <a href="/forgot-password" className="auth-link">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
