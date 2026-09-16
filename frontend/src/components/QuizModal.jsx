import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, X } from 'lucide-react';

export default function QuizModal({ isOpen, onClose, onComplete, booksList = [] }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    mood: '',
    genre: '',
    theme: '',
    favorite_book_id: null,
  });

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(answers);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="modal-overlay">
      <div style={styles.modalContent}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <Sparkles size={14} color="#7a3e1d" />
            <span>Interactive Quiz • Step {step} of {totalSteps}</span>
          </div>
          <h2 style={styles.title}>Discover Your Next Favorite Read</h2>
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${(step / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step 1: Mood */}
        {step === 1 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.questionTitle}>1. What reading mood are you in today?</h3>
            <div style={styles.optionsGrid}>
              {[
                { id: 'thrilling', label: '⚡ Thrilling & Fast-Paced', desc: 'High stakes, twists, action' },
                { id: 'cozy', label: '☕ Warm, Cozy & Emotional', desc: 'Heartwarming characters, relationships' },
                { id: 'mysterious', label: '🕵️ Dark & Mysterious', desc: 'Secrets, detective work, suspense' },
                { id: 'epic', label: '🏰 Epic & Immersive', desc: 'Expansive world building, magic' },
                { id: 'mindbending', label: '🚀 Thought-Provoking Sci-Fi', desc: 'Futuristic, AI, space exploration' }
              ].map((m) => (
                <div
                  key={m.id}
                  style={{
                    ...styles.optionCard,
                    ...(answers.mood === m.label ? styles.optionSelected : {})
                  }}
                  onClick={() => setAnswers({ ...answers, mood: m.label })}
                >
                  <div style={styles.optionLabel}>{m.label}</div>
                  <div style={styles.optionDesc}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Genre */}
        {step === 2 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.questionTitle}>2. Choose your primary genre preference</h3>
            <div style={styles.optionsGrid}>
              {['Fantasy', 'Mystery & Thriller', 'Romance', 'Science Fiction', 'Classics', 'Young Adult'].map((g) => (
                <div
                  key={g}
                  style={{
                    ...styles.optionCard,
                    ...(answers.genre === g ? styles.optionSelected : {})
                  }}
                  onClick={() => setAnswers({ ...answers, genre: g })}
                >
                  <div style={styles.optionLabel}>{g}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Theme */}
        {step === 3 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.questionTitle}>3. What theme or element appeals to you most?</h3>
            <div style={styles.optionsGrid}>
              {[
                'Courtroom / Legal Drama',
                'Magical School & Wizardry',
                'Dystopian Survival',
                'Small-town Coming of Age',
                'Conspiracy & Secret Societies',
                'Historical Regency Romance'
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    ...styles.optionCard,
                    ...(answers.theme === t ? styles.optionSelected : {})
                  }}
                  onClick={() => setAnswers({ ...answers, theme: t })}
                >
                  <div style={styles.optionLabel}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Seed Book */}
        {step === 4 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.questionTitle}>4. Pick a book you previously enjoyed (Optional)</h3>
            <p style={{ fontSize: '0.85rem', color: '#6c544a', marginBottom: '14px' }}>
              This helps our Collaborative Filtering model find books with similar reader rating patterns.
            </p>
            <select
              value={answers.favorite_book_id || ''}
              onChange={(e) => setAnswers({ ...answers, favorite_book_id: Number(e.target.value) || null })}
              style={styles.selectInput}
            >
              <option value="">-- Select a seed book from catalog (Optional) --</option>
              {booksList.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.title} ({b.authors})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Modal Controls */}
        <div style={styles.footer}>
          {step > 1 ? (
            <button className="btn-secondary" onClick={handleBack}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          <button className="btn-primary" onClick={handleNext}>
            <span>{step === totalSteps ? 'Get AI Recommendations' : 'Next Question'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalContent: {
    backgroundColor: '#faf4e8',
    border: '2px solid #7a3e1d',
    borderRadius: '16px',
    maxWidth: '650px',
    width: '100%',
    padding: '28px',
    position: 'relative',
    boxShadow: '0 16px 36px rgba(30, 18, 14, 0.4)',
  },
  closeBtn: {
    position: 'absolute',
    right: '18px',
    top: '18px',
    background: 'none',
    border: 'none',
    color: '#6c544a',
    cursor: 'pointer',
  },
  header: {
    marginBottom: '20px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f7eed7',
    border: '1px solid #d8b871',
    color: '#7a3e1d',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.4rem',
    color: '#2c1a14',
    margin: '0 0 12px 0',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: '#e6d8c5',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7a3e1d',
    transition: 'width 0.3s ease',
  },
  stepContainer: {
    minHeight: '260px',
    marginBottom: '20px',
  },
  questionTitle: {
    fontSize: '1.1rem',
    color: '#2c1a14',
    marginBottom: '16px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  optionCard: {
    backgroundColor: '#f6efe2',
    border: '1px solid #d9c7b1',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  optionSelected: {
    backgroundColor: '#f7eed7',
    borderColor: '#7a3e1d',
    boxShadow: '0 0 0 2px #7a3e1d',
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: '0.92rem',
    color: '#2c1a14',
  },
  optionDesc: {
    fontSize: '0.78rem',
    color: '#6c544a',
    marginTop: '4px',
  },
  selectInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #d9c7b1',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    color: '#2c1a14',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e6d8c5',
  },
};
