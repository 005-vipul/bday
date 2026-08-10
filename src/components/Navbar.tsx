import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navLinks = [
  { to: '/',         label: 'Home',      emoji: '🏡' },
  { to: '/story',    label: 'Our Story', emoji: '📜' },
  { to: '/gallery',  label: 'Gallery',   emoji: '🎨' },
  { to: '/letter',   label: 'Letter',    emoji: '💌' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Add backdrop blur when scrolled
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.35s ease',
        background: scrolled
          ? 'rgba(253,250,246,0.88)'
          : 'rgba(253,250,246,0.60)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(209,75,126,0.15)'
          : '1px solid rgba(255,255,255,0.5)',
        boxShadow: scrolled ? '0 4px 24px rgba(209,75,126,0.08)' : 'none',
      }}
    >
      <nav
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '4.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Brand */}
        <NavLink
          to="/"
          id="navbar-logo"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span style={{ fontSize: '1.6rem' }}>💖</span>
          <span
            className="font-heading gradient-text"
            style={{ fontSize: '1.55rem', fontWeight: 700, lineHeight: 1 }}
          >
            For You
          </span>
        </NavLink>

        {/* Desktop Links */}
        <ul
          id="navbar-desktop-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            listStyle: 'none',
          }}
          className="navbar-desktop"
        >
          {navLinks.map(({ to, label, emoji }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                id={`nav-link-${label.toLowerCase().replace(' ', '-')}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#d14b7e' : '#6b3a52',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(249,213,229,0.8), rgba(232,213,245,0.8))'
                    : 'transparent',
                  boxShadow: isActive ? '0 2px 12px rgba(209,75,126,0.15)' : 'none',
                  transition: 'all 0.25s ease',
                })}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          id="navbar-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '0.5rem',
            color: '#d14b7e',
            fontSize: '1.5rem',
          }}
          className="navbar-hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        id="navbar-mobile-menu"
        style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? '300px' : '0',
          transition: 'max-height 0.35s ease',
          background: 'rgba(253,250,246,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(209,75,126,0.1)',
        }}
      >
        <ul style={{ listStyle: 'none', padding: '0.75rem 1.5rem 1rem' }}>
          {navLinks.map(({ to, label, emoji }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                id={`nav-mobile-link-${label.toLowerCase().replace(' ', '-')}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.7rem 0.75rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#d14b7e' : '#6b3a52',
                  background: isActive ? 'rgba(249,213,229,0.5)' : 'transparent',
                  transition: 'all 0.2s ease',
                  marginBottom: '0.2rem',
                })}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
