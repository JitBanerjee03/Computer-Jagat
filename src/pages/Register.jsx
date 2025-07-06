import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .then(data => setSubjectAreas(data))
      .catch(error => console.error('Error fetching subject areas:', error));
  }, []);

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

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleSubjectAreaToggle = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      subject_areas: prev.subject_areas.includes(subjectId)
        ? prev.subject_areas.filter(id => id !== subjectId)
        : [...prev.subject_areas, subjectId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.roles.length === 0) newErrors.roles = 'Please select at least one role';

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
      </div>
      
      <div className="registration-form">
        <div className="form-header">
          <h2 className="form-title">Journal Management System Registration</h2>
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
                />
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

          <div className="form-section">
            <h3 className="section-title">Subject Areas</h3>
            <div className="subject-areas-container">
              {subjectAreas.map(subject => (
                <div key={subject.id} className="subject-option">
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    checked={formData.subject_areas.includes(subject.id)}
                    onChange={() => handleSubjectAreaToggle(subject.id)}
                  />
                  <label htmlFor={`subject-${subject.id}`}>{subject.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Roles *</h3>
            <div className="role-options">
              {roleOptions.map(role => (
                <div key={role.id} className="role-option">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={formData.roles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                  <label htmlFor={`role-${role.id}`}>{role.label}</label>
                </div>
              ))}
            </div>
            {errors.roles && <span className="error-message">{errors.roles}</span>}
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