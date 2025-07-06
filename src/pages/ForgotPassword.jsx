import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaKey, 
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaRedo,
  FaSignInAlt
} from 'react-icons/fa';
import './styles/Login.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP and New Password, 3: Success
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const validateEmailStep = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const validatePasswordStep = () => {
    const newErrors = {};
    if (!formData.otp) newErrors.otp = 'OTP is required';
    if (!formData.new_password) newErrors.new_password = 'New password is required';
    if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm your password';
    if (formData.new_password && formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateEmailStep()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/request-password-reset-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send OTP. Please try again.');
      }

      setMessage('OTP has been sent to your email. Please check your inbox.');
      setStep(2);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordStep()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/verify-otp-reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          new_password: formData.new_password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Password reset failed. Please try again.');
      }

      setMessage('Password has been reset successfully!');
      setIsSuccess(true);
      setStep(3);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/request-password-reset-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend OTP. Please try again.');
      }

      setMessage('New OTP has been sent to your email.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="auth-container">
        <div className="auth-left-panel">
          <div className="auth-logo">
            <img src="/logo.png" alt="Journal Management System Logo" />
          </div>
          <div className="auth-content">
            <h1>Journal Management System</h1>
            <p className="auth-subtitle">Password Recovery</p>
            <p className="auth-description">
              Your password has been successfully updated.
            </p>
          </div>
        </div>
        
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="success-message-container">
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              <h2>Password Reset Successful!</h2>
              <p className="success-description">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <div className="success-actions">
                <a href="/login" className="auth-submit-btn success-btn">
                  <FaSignInAlt /> Go to Login
                </a>
              </div>
            </div>
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
          <p className="auth-subtitle">Password Recovery</p>
          <p className="auth-description">
            Reset your password to regain access to your account.
          </p>
        </div>
      </div>
      
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>{step === 1 ? 'Reset Password' : 'Set New Password'}</h2>
            <p>
              {step === 1 
                ? 'Enter your email to receive a verification code' 
                : 'Enter the OTP and your new password'}
            </p>
          </div>

          {message && (
            <div className={`auth-form-message ${isSuccess ? 'success' : 'error'}`}>
              <span className="message-icon">
                {isSuccess ? <FaCheckCircle /> : '!'}
              </span>
              <span>{message}</span>
            </div>
          )}

          {step === 1 ? (
            <form className="auth-form" onSubmit={handleRequestOTP}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-container">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your registered email"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" /> Sending OTP...
                    </>
                  ) : (
                    <>
                      Get OTP
                    </>
                  )}
                </button>
              </div>

              <div className="auth-form-footer">
                <a href="/login" className="auth-link">
                  <FaArrowLeft /> Back to Login
                </a>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>Verification Code (OTP)</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className={errors.otp ? 'error' : ''}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    className="resend-otp-btn"
                    onClick={handleResendOTP}
                    disabled={isSubmitting}
                  >
                    <FaRedo /> Resend OTP
                  </button>
                </div>
                {errors.otp && <span className="error-message">{errors.otp}</span>}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="input-container">
                  <FaKey className="input-icon" />
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={errors.new_password ? 'error' : ''}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                {errors.new_password && <span className="error-message">{errors.new_password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-container">
                  <FaKey className="input-icon" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? 'error' : ''}
                    placeholder="Confirm your new password"
                  />
                </div>
                {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" /> Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                    </>
                  )}
                </button>
              </div>

              <div className="auth-form-footer">
                <button 
                  type="button" 
                  className="auth-link-btn"
                  onClick={() => setStep(1)}
                >
                  <FaArrowLeft /> Back to Email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;