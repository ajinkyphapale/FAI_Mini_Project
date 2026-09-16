import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export default function FreeTextSearch({ onRecommendByText, loading }) {
  const [prompt, setPrompt] = useState('');

  const samplePrompts = [
    "I want a dark mystery novel with a detective like Sherlock Holmes",
    "Epic high-fantasy with dragons, magic systems, and ancient lore",
    "A cozy, emotional coming-of-age story set in a small town",
    "Mind-bending sci-fi space opera with artificial intelligence"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onRecommendByText(prompt.trim());
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.sparkleIcon}>
          <Sparkles size={24} color="#fcf9f2" />
        </div>
        <div>
          <h2 style={styles.title}>AI Librarian Assistant</h2>
          <p style={styles.subtitle}>
            Describe what you're in the mood to read in plain English. Our Hybrid ML Recommender + Gemini LLM will re-rank candidate books and write custom explanations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <textarea
            rows={3}
            placeholder="e.g. 'I'm looking for a fast-paced thriller with plot twists and conspiracy theories...'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.textarea}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !prompt.trim()}
            style={{
              opacity: loading || !prompt.trim() ? 0.6 : 1,
              padding: '12px 24px',
              borderRadius: '10px'
            }}
          >
            <span>{loading ? 'Consulting Gemini...' : 'Generate Recommendations'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Suggested Quick Prompts */}
      <div style={styles.promptIdeas}>
        <div style={styles.ideaTitle}>
          <Lightbulb size={15} color="#c69214" />
          <span>Try an example prompt:</span>
        </div>
        <div style={styles.pillsContainer}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              style={styles.pill}
              onClick={() => {
                setPrompt(p);
                onRecommendByText(p);
              }}
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#382219',
    border: '2px solid #7a3e1d',
    borderRadius: '16px',
    padding: '24px',
    color: '#fcf9f2',
    boxShadow: '0 8px 24px rgba(44, 26, 20, 0.25)',
    marginBottom: '32px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '18px',
  },
  sparkleIcon: {
    backgroundColor: '#7a3e1d',
    border: '1px solid #c69214',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fcf9f2',
    fontSize: '1.4rem',
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subtitle: {
    color: '#d4beab',
    fontSize: '0.88rem',
    margin: 0,
  },
  form: {
    marginBottom: '16px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #7a3e1d',
    backgroundColor: '#271710',
    color: '#fcf9f2',
    fontSize: '0.98rem',
    fontFamily: "'Lora', Georgia, serif",
    resize: 'vertical',
    outline: 'none',
  },
  promptIdeas: {
    borderTop: '1px solid #4a2d21',
    paddingTop: '14px',
  },
  ideaTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#c69214',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  pillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    backgroundColor: '#271710',
    color: '#d4beab',
    border: '1px solid #4a2d21',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
};
