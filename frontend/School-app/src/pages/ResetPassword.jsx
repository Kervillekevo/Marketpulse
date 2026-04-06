import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './ResetPassword.css';

const BASE_URL = "http://127.0.0.1:8000";

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [newPassword,          setNewPassword]          = useState('');
  const [confirmPassword,      setConfirmPassword]      = useState('');
  const [loading,              setLoading]              = useState(false);
  const [showNewPassword,      setShowNewPassword]      = useState(false);
  const [showConfirmPassword,  setShowConfirmPassword]  = useState(false);

  const getStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6)   return 'weak';
    if (pwd.length < 10)  return 'medium';
    return 'strong';
  };

  const strength = getStrength(newPassword);

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/password-reset-confirm/${uidb64}/${token}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPassword, token, uidb64 }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful! Please log in.');
        navigate('/', { replace: true });
      } else {
        alert('Error: ' + (data.error || JSON.stringify(data)));
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="reset-page-wrapper">
        <div className="reset-card">

          <div className="reset-icon-wrap">🔑</div>

          <div className="reset-card-header">
            <h2>Set New Password</h2>
            <p>Choose a strong password to secure your MarketPulse account.</p>
          </div>

          <form className="reset-form" onSubmit={handleReset}>

            <div className="field-group">
              <div className="field-label">New Password</div>
              <div className="password-field">
                <input
                  className="reset-input"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowNewPassword((v) => !v)}
                >
                  {showNewPassword ? '🙈' : '👁'}
                </span>
              </div>

              {strength && (
                <>
                  <div className="password-strength">
                    <div className={`strength-bar ${strength}`} />
                    <div className={`strength-bar ${strength === 'medium' || strength === 'strong' ? strength : ''}`} />
                    <div className={`strength-bar ${strength === 'strong' ? 'strong' : ''}`} />
                  </div>
                  <div className={`strength-label ${strength}`}>
                    {strength === 'weak' && 'Weak password'}
                    {strength === 'medium' && 'Medium strength'}
                    {strength === 'strong' && 'Strong password'}
                  </div>
                </>
              )}
            </div>

            <div className="field-group">
              <div className="field-label">Confirm Password</div>
              <div className="password-field">
                <input
                  className="reset-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? '🙈' : '👁'}
                </span>
              </div>

              {passwordsMatch   && <div className="match-hint match">Passwords match</div>}
              {passwordsMismatch && <div className="match-hint no-match">Passwords do not match</div>}
            </div>

            <div className="reset-divider" />

            <button
              className="reset-button"
              type="submit"
              disabled={loading || passwordsMismatch}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

          </form>

          <div className="reset-back-link">
            Remember your password?{' '}
            <span onClick={() => navigate('/')}>Sign In</span>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}