import React, { useState, useEffect, useRef } from 'react';
import './styles/RegistrationForm.css';
import { useNavigate } from 'react-router-dom';

const Register = () => { 
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    institution: '',
    position_title: '',
    country: '',
    cv: null,
    roles: [],
    subject_areas: []
  });
  
  const navigate = useNavigate();
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [filteredSubjectAreas, setFilteredSubjectAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const subjectDropdownRef = useRef(null);
  const rolesDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const roleOptions = [
    { id: 'author', label: 'Author' },
    { id: 'reviewer', label: 'Reviewer' },
    { id: 'associate_editor', label: 'Associate Editor' },
    { id: 'area_editor', label: 'Area Editor' },
    { id: 'editor_in_chief', label: 'Editor in Chief' }
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`)
      .then(response => response.json())
      .then(data => {
        setSubjectAreas(data);
        setFilteredSubjectAreas(data);
      })
      .catch(error => console.error('Error fetching subject areas:', error));
  }, []);

  // Filter subject areas based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = subjectAreas.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubjectAreas(filtered);
    } else {
      setFilteredSubjectAreas(subjectAreas);
    }
  }, [searchTerm, subjectAreas]);

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target)) {
        setShowRolesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showSubjectDropdown && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showSubjectDropdown]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (fieldName, value, isChecked) => {
    setFormData(prev => {
      const currentValues = [...prev[fieldName]];
      if (isChecked) {
        return { ...prev, [fieldName]: [...currentValues, value] };
      } else {
        return { ...prev, [fieldName]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleSubjectDropdownToggle = () => {
    const newState = !showSubjectDropdown;
    setShowSubjectDropdown(newState);
    if (newState) {
      setSearchTerm('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character';
      }
    }

    // Phone number validation (optional but must be valid if provided)
    if (formData.phone_number) {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        newErrors.phone_number =
          'Phone number must be 10–15 digits and may include a leading +';
      }
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'Please select at least one role';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone_number', formData.phone_number);
      data.append('institution', formData.institution);
      data.append('position_title', formData.position_title);
      data.append('country', formData.country);
      if (formData.cv) data.append('cv', formData.cv);
      
      formData.roles.forEach(role => data.append('roles', role));
      formData.subject_areas.forEach(subject => data.append('subject_areas', subject));

      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/register/`, {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error:', errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="header-section">
        <div className="logo-container">
          <img src="/logo.png" alt="Journal Management System Logo" className="logo" />
        </div>
        <h1 className="system-title">Journal Management System</h1>
        <p className="system-subtitle">Create your account to get started</p>
      </div>
      
      <div className="registration-form">
        <div className="form-header">
          <h2 className="form-title">Registration</h2>
          <div className="form-divider"></div>
        </div>

        {errors.form && (
          <div className="form-error">
            {errors.form}
          </div>
        )}

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? 'error' : ''}
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'error' : ''}
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Professional Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={errors.phone_number ? 'error' : ''}
                />
                {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
              </div>

              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position Title</label>
                <input
                  type="text"
                  name="position_title"
                  value={formData.position_title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Documents</h3>
            <div className="form-group">
              <label>CV/Resume (PDF)</label>
              <div className="file-upload">
                <input
                  type="file"
                  name="cv"
                  onChange={handleChange}
                  id="cvUpload"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="cvUpload" className="file-label">
                  Choose File
                </label>
                <span className="file-name">
                  {formData.cv ? formData.cv.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Improved Subject Areas Dropdown with Search */}
          <div className="form-section">
            <h3 className="section-title">Subject Areas</h3>
            <div className="form-group">
              <label>Select Subject Areas</label>
              <div className="custom-dropdown" ref={subjectDropdownRef}>
                <div 
                  className={`dropdown-toggle ${showSubjectDropdown ? 'active' : ''}`}
                  onClick={handleSubjectDropdownToggle}
                >
                  {formData.subject_areas.length > 0 
                    ? `${formData.subject_areas.length} subject area(s) selected`
                    : 'Choose subject areas'
                  }
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showSubjectDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-search">
                      <input
                        type="text"
                        placeholder="Search subject areas..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        ref={searchInputRef}
                        className="search-input"
                      />
                    </div>
                    <div className="dropdown-items-container">
                      {filteredSubjectAreas.length > 0 ? (
                        filteredSubjectAreas.map(subject => (
                          <label key={subject.id} className="dropdown-item">
                            <input
                              type="checkbox"
                              checked={formData.subject_areas.includes(subject.id.toString())}
                              onChange={(e) => handleCheckboxChange('subject_areas', subject.id.toString(), e.target.checked)}
                            />
                            <span>{subject.name}</span>
                          </label>
                        ))
                      ) : (
                        <div className="dropdown-no-results">
                          No subject areas found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Improved Roles Dropdown */}
          <div className="form-section">
            <h3 className="section-title">Roles *</h3>
            <div className="form-group">
              <label>Select Roles</label>
              <div className={`custom-dropdown ${errors.roles ? 'error' : ''}`} ref={rolesDropdownRef}>
                <div 
                  className={`dropdown-toggle ${showRolesDropdown ? 'active' : ''}`}
                  onClick={() => setShowRolesDropdown(!showRolesDropdown)}
                >
                  {formData.roles.length > 0 
                    ? `${formData.roles.length} role(s) selected`
                    : 'Choose roles'
                  }
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showRolesDropdown && (
                  <div className="dropdown-menu">
                    {roleOptions.map(role => (
                      <label key={role.id} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(role.id)}
                          onChange={(e) => handleCheckboxChange('roles', role.id, e.target.checked)}
                        />
                        <span>{role.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.roles && <span className="error-message">{errors.roles}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            <p className="form-footer">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;