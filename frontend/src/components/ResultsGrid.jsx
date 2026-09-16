import React from 'react';
import BookCard from './BookCard';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

export default function ResultsGrid({
  title,
  subtitle,
  modeLabel,
  books = [],
  loading = false,
  onSelectBook,
  onRecommendSimilar,
  favorites = [],
  onToggleFavorite,
}) {
  const isBookFavorite = (bookId) => favorites.some((f) => f.book_id === bookId);

  return (
    <div style={styles.container}>
      {/* Grid Section Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.titleWithBadge}>
            <h2 style={styles.title}>{title}</h2>
            {modeLabel && (
              <span className="badge-gold">
                <Layers size={12} />
                <span>{modeLabel}</span>
              </span>
            )}
          </div>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        <div style={styles.countBadge}>
          {books.length} {books.length === 1 ? 'Book' : 'Books'}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={styles.skeletonCard}>
              <div style={styles.skeletonCover} />
              <div style={{ padding: '16px' }}>
                <div style={styles.skeletonTextLong} />
                <div style={styles.skeletonTextShort} />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div style={styles.emptyContainer}>
          <BookOpen size={48} color="#d9c7b1" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#2c1a14', marginBottom: '6px' }}>No Books Found</h3>
          <p style={{ fontSize: '0.88rem', color: '#6c544a', maxWidth: '400px', margin: '0 auto' }}>
            Try adjusting your search criteria, clearing active filters, or typing a different AI prompt.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {books.map((book) => (
            <BookCard
              key={book.book_id}
              book={book}
              onSelect={onSelectBook}
              onRecommendSimilar={onRecommendSimilar}
              isFavorite={isBookFavorite(book.book_id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '40px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '20px',
    borderBottom: '2px solid #e6d8c5',
    paddingBottom: '12px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  titleWithBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '1.4rem',
    margin: 0,
    color: '#2c1a14',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#6c544a',
    margin: '4px 0 0 0',
  },
  countBadge: {
    backgroundColor: '#f6efe2',
    border: '1px solid #d9c7b1',
    color: '#7a3e1d',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f6efe2',
    border: '1px border-dashed #d9c7b1',
    borderRadius: '16px',
  },
  skeletonCard: {
    backgroundColor: '#f6efe2',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #e4d5c1',
    height: '350px',
  },
  skeletonCover: {
    backgroundColor: '#e6d8c5',
    height: '200px',
  },
  skeletonTextLong: {
    backgroundColor: '#e6d8c5',
    height: '16px',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  skeletonTextShort: {
    backgroundColor: '#e6d8c5',
    height: '12px',
    width: '60%',
    borderRadius: '4px',
  },
};
