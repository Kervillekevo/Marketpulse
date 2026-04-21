import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const {
    user, signIn, signUp, signOut,
    requestPasswordReset, updateProfile,
    reloadProfile, cartCount,
  } = useContext(AuthContext);

  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuOpen,          setMenuOpen]          = useState(false);
  const [showAuthModal,     setShowAuthModal]     = useState(false);
  const [isSignUp,          setIsSignUp]          = useState(false);
  const [isReset,           setIsReset]           = useState(false);
  const [username,          setUsername]          = useState('');
  const [email,             setEmail]             = useState('');
  const [password,          setPassword]          = useState('');
  const [showProfileModal,  setShowProfileModal]  = useState(false);
  const [bio,               setBio]               = useState('');
  const [phone,             setPhone]             = useState('');
  const [profilePhotoFile,  setProfilePhotoFile]  = useState(null);
  const [removePhoto,       setRemovePhoto]       = useState(false);

  const resetAuthForm = () => {
    setUsername(''); setEmail(''); setPassword('');
    setIsSignUp(false); setIsReset(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(username, password);
      setShowAuthModal(false);
      resetAuthForm();
    } catch {
      alert('Sign-in failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(username, email, password);
      setIsSignUp(false);
      resetAuthForm();
    } catch {
      alert('Sign-up failed. Try again.');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      alert('If the email exists, a reset link has been sent.');
      setIsReset(false);
      resetAuthForm();
    } catch {
      alert('Failed to send reset link.');
    }
  };

  const handleOpenProfileModal = () => {
    if (user) {
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setProfilePhotoFile(null);
      setRemovePhoto(false);
    }
    setShowProfileModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ bio, phone, profile_photo: profilePhotoFile, removePhoto });
      await reloadProfile();
      alert('Profile updated!');
      setShowProfileModal(false);
    } catch {
      alert('Failed to update profile.');
    }
  };

  const navLinks = [
    { label: 'Home',       path: '/' },
    { label: 'Products',   path: '/products' },
    { label: 'My Orders',  path: '/orders' },
    { label: 'About Us',   path: '/About us' },
    { label: 'Contact Us', path: 'Contact us' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">

        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-b">B</span>
          <span className="logo-main">igFive</span>
          <span className="logo-tech">Technologies</span>
        </div>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <div
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </div>
          ))}
        </nav>

        <div className="header-actions">
          <div className="cart-wrapper" onClick={() => navigate('/Cart')}>
            <img src="/cart.png" alt="Cart" className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          {user && (
            <img
              src={user.profile_photo || '/avatar.png'}
              alt="Profile"
              className="header-avatar"
              onClick={handleOpenProfileModal}
            />
          )}

          {user ? (
            <button className="signout-btn" onClick={signOut}>
              Sign Out
            </button>
          ) : (
            <button className="header-btn" onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <div
            key={link.path}
            className="mobile-nav-link"
            onClick={() => handleNav(link.path)}
          >
            {link.label}
          </div>
        ))}
      </div>

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <form
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={isReset ? handleReset : isSignUp ? handleSignUp : handleSignIn}
          >
            <div>
              <h2>
                {isReset ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="modal-subtitle">
                {isReset
                  ? 'Enter your email to receive a reset link'
                  : isSignUp
                  ? 'Sign up to start shopping at Big Five Technologies'
                  : 'Sign in to your Big Five Technologies account'}
              </p>
            </div>

            {!isReset && (
              <>
                <div className="modal-label">Username</div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}

            {(isSignUp || isReset) && (
              <>
                <div className="modal-label">Email</div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}

            {!isReset && (
              <>
                <div className="modal-label">Password</div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}

            <button type="submit" className="modal-submit-btn">
              {isReset ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <div className="modal-divider" />

            {!isReset && (
              <div className="modal-link-row">
                {isSignUp ? (
                  <>Already have an account?{' '}
                    <span className="modal-link" onClick={() => setIsSignUp(false)}>Sign In</span>
                  </>
                ) : (
                  <>No account?{' '}
                    <span className="modal-link" onClick={() => setIsSignUp(true)}>Sign Up</span>
                  </>
                )}
              </div>
            )}

            <div className="modal-link-row">
              {isReset ? (
                <span className="modal-link" onClick={() => setIsReset(false)}>← Back to Sign In</span>
              ) : (
                <span className="modal-link" onClick={() => { setIsReset(true); setIsSignUp(false); }}>
                  Forgot Password?
                </span>
              )}
            </div>

            <button type="button" className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {showProfileModal && user && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <div className="profile-avatar-section">
              <img
                src={!removePhoto && user.profile_photo ? user.profile_photo : '/avatar.png'}
                alt="Profile"
              />
              <div className="profile-avatar-info">
                <div className="profile-avatar-name">{user.username}</div>
                <div className="profile-avatar-email">{user.email}</div>
              </div>
            </div>

            {user.profile_photo && !removePhoto && (
              <button className="remove-photo-btn" onClick={() => setRemovePhoto(true)}>
                🗑 Remove Photo
              </button>
            )}

            <div className="modal-label">Upload New Photo</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProfilePhotoFile(e.target.files[0]);
                setRemovePhoto(false);
              }}
            />

            <div className="modal-label">Bio</div>
            <textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="modal-label">Phone</div>
            <input
              type="text"
              placeholder="e.g. 0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button className="modal-submit-btn" onClick={handleSaveProfile}>
              Save Changes
            </button>
            <button className="modal-close-btn" onClick={() => setShowProfileModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}