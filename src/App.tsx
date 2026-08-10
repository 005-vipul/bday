import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Landing from './pages/Landing';
import Story from './pages/Story';
import Gallery from './pages/Gallery';
import Letter from './pages/Letter';
import MusicPlayer from './components/MusicPlayer';

/** Scroll to top on every navigation */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Navbar />
      <MusicPlayer />
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/"        element={<Landing />} />
          <Route path="/story"   element={<Story />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/letter"  element={<Letter />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <main
                id="page-not-found"
                className="page-wrapper"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100dvh',
                  gap: '1rem',
                }}
              >
                <p style={{ fontSize: '4rem' }}>🌸</p>
                <h1 className="font-heading gradient-text" style={{ fontSize: '2rem' }}>
                  Page Not Found
                </h1>
                <p style={{ color: 'var(--color-ink-light)' }}>
                  This petal drifted away…
                </p>
              </main>
            }
          />
        </Routes>
      </PageTransition>
    </>
  );
}
