import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Star, Bookmark } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, favoritesCount, onOpenFavorites, healthStatus }) {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Branding */}
        <div style={styles.brand} onClick={() => setActiveTab('search')}>
          <div style={styles.logoIcon}>
            <BookOpen size={24} color="#fcf9f2" />
          </div>
          <div>
            <h1 style={styles.title}>Alexandria</h1>
            <p style={styles.subtitle}>AI-Powered Library Assistant • FAI Mini Project</p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <nav style={styles.nav}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'search' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('search')}
          >
            <BookOpen size={17} />
            <span>Catalog Search</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'ai' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={17} color="#c69214" />
            <span>AI Free-Text Prompt</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'quiz' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle size={17} />
            <span>Book Quiz</span>
          </button>
        </nav>

        {/* Action Buttons & Favorites */}
        <div style={styles.rightSection}>
          {healthStatus && (
            <div style={styles.healthBadge} title={`Dataset: ${healthStatus.dataset?.total_books} books`}>
              <span style={{
                ...styles.healthDot,
                backgroundColor: healthStatus.status === 'online' ? '#2e7d32' : '#c62828'
              }} />
              <span>{healthStatus.gemini_active ? 'Gemini AI Online' : 'Hybrid Engine Active'}</span>
            </div>
          )}

          <button style={styles.favBtn} onClick={onOpenFavorites}>
            <Star size={18} fill={favoritesCount > 0 ? '#c69214' : 'none'} color="#c69214" />
            <span>Saved ({favoritesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#382219',
    borderBottom: '3px solid #7a3e1d',
    color: '#fcf9f2',
    boxShadow: '0 4px 20px rgba(28, 16, 12, 0.4)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  logoIcon: {
    backgroundColor: '#7a3e1d',
    padding: '10px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #c69214'
  },
  title: {
    color: '#fcf9f2',
    fontSize: '1.6rem',
    margin: 0,
    lineHeight: 1.1,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subtitle: {
    color: '#d4beab',
    fontSize: '0.78rem',
    margin: 0,
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#271710',
    padding: '5px',
    borderRadius: '12px',
    border: '1px solid #4a2d21'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: '#c2ab99',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    fontSize: '0.88rem',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: '#7a3e1d',
    color: '#ffffff',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  healthBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#271710',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    color: '#d4beab',
    border: '1px solid #4a2d21'
  },
  healthDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  favBtn: {
    backgroundColor: '#4a2919',
    border: '1px solid #8c4c28',
    color: '#fcf9f2',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease'
  }
};
