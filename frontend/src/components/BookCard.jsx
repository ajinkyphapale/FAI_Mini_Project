import React from 'react';
import { Star, Sparkles, BookOpen, Heart } from 'lucide-react';

export default function BookCard({ book, onSelect, onRecommendSimilar, isFavorite, onToggleFavorite }) {
  const tags = book.tag_name ? String(book.tag_name).split(' ').slice(0, 3) : [];
  const score = book.hybrid_score ? Math.round(book.hybrid_score * 100) : null;

  return (
    <div style={styles.card}>
      {/* Top Cover Section */}
      <div style={styles.coverWrapper} onClick={() => onSelect(book)}>
        <img
          src={book.image_url}
          alt={book.title}
          style={styles.coverImg}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.gr-assets.com/books/1447303603l/2767052.jpg';
          }}
        />

        {/* Favorite Button Overlay */}
        <button
          style={styles.favBtn}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book);
          }}
          title={isFavorite ? 'Remove from saved books' : 'Save to session favorites'}
        >
          <Star
            size={18}
            fill={isFavorite ? '#c69214' : 'none'}
            color={isFavorite ? '#c69214' : '#6c544a'}
          />
        </button>

        {/* Match Percentage Badge */}
        {score !== null && (
          <div style={styles.scoreBadge}>
            <span>{score}% Match</span>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div style={styles.body}>
        <div style={styles.metaRow}>
          <div style={styles.ratingBadge}>
            <Star size={13} fill="#c69214" color="#c69214" />
            <span>{book.average_rating || '4.0'}</span>
          </div>
          {book.original_publication_year && (
            <span style={styles.yearText}>{book.original_publication_year}</span>
          )}
        </div>

        <h3 style={styles.title} onClick={() => onSelect(book)} title={book.title}>
          {book.title}
        </h3>
        <p style={styles.authors}>{book.authors}</p>

        {/* Tags pills */}
        <div style={styles.tagsRow}>
          {tags.map((t, idx) => (
            <span key={idx} className="badge-tag">
              {t}
            </span>
          ))}
        </div>

        {/* AI Explanation Box */}
        {book.ai_explanation && (
          <div style={styles.explanationBox}>
            <div style={styles.explanationHeader}>
              <Sparkles size={13} color="#c69214" />
              <span>AI Recommendation Reason</span>
            </div>
            <p style={styles.explanationText}>"{book.ai_explanation}"</p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.actionsRow}>
          <button
            style={styles.similarBtn}
            onClick={() => onRecommendSimilar(book)}
            title="Find similar books using hybrid TF-IDF + Collaborative engine"
          >
            <BookOpen size={14} />
            <span>Similar Books</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#f6efe2',
    border: '1px solid #e4d5c1',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-book)',
    transition: 'all 0.25s ease',
    position: 'relative',
  },
  coverWrapper: {
    height: '210px',
    backgroundColor: '#382219',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImg: {
    height: '100%',
    width: 'auto',
    maxHeight: '200px',
    objectFit: 'contain',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: 'transform 0.3s ease',
  },
  favBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(252, 249, 242, 0.9)',
    border: '1px solid #d9c7b1',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  scoreBadge: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: '#7a3e1d',
    color: '#ffffff',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.72rem',
    fontWeight: '700',
    border: '1px solid #c69214',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#7a3e1d',
  },
  yearText: {
    fontSize: '0.78rem',
    color: '#9e877c',
  },
  title: {
    fontSize: '1.05rem',
    margin: '0 0 4px 0',
    color: '#2c1a14',
    fontFamily: "'Playfair Display', Georgia, serif",
    cursor: 'pointer',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  authors: {
    fontSize: '0.82rem',
    color: '#6c544a',
    margin: '0 0 10px 0',
    fontWeight: '500',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '12px',
  },
  explanationBox: {
    backgroundColor: '#f7eed7',
    border: '1px solid #d8b871',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '12px',
  },
  explanationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#7a3e1d',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  explanationText: {
    fontSize: '0.8rem',
    color: '#4a3328',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.35,
  },
  actionsRow: {
    marginTop: 'auto',
    paddingTop: '8px',
  },
  similarBtn: {
    width: '100%',
    backgroundColor: '#e6d8c5',
    color: '#2c1a14',
    border: '1px solid #d9c7b1',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
};
