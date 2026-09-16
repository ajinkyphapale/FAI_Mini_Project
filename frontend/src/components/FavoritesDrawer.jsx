import React from 'react';
import { X, Star, Trash2, Sparkles, BookOpen } from 'lucide-react';

export default function FavoritesDrawer({ isOpen, onClose, favorites, onRemove, onRecommendFromFavorites, onSelectBook }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div style={styles.drawer}>
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <Star size={20} fill="#c69214" color="#c69214" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Session Saved Books</h3>
            <span style={styles.badge}>{favorites.length}</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Action Button */}
        {favorites.length > 0 && (
          <div style={styles.actionBanner}>
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                onRecommendFromFavorites();
                onClose();
              }}
            >
              <Sparkles size={16} />
              <span>Recommend Based on Saved Books</span>
            </button>
          </div>
        )}

        {/* List of Favorites */}
        <div style={styles.list}>
          {favorites.length === 0 ? (
            <div style={styles.emptyState}>
              <BookOpen size={48} color="#d9c7b1" style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: '600', color: '#6c544a', marginBottom: '4px' }}>No saved books yet</p>
              <p style={{ fontSize: '0.82rem', color: '#9e877c' }}>
                Star books while browsing to build your personal reading list during this session.
              </p>
            </div>
          ) : (
            favorites.map((book) => (
              <div key={book.book_id} style={styles.itemCard}>
                <img
                  src={book.image_url}
                  alt={book.title}
                  style={styles.itemImg}
                  onClick={() => onSelectBook(book)}
                />
                <div style={styles.itemInfo}>
                  <h4
                    style={styles.itemTitle}
                    onClick={() => onSelectBook(book)}
                  >
                    {book.title}
                  </h4>
                  <p style={styles.itemAuthor}>{book.authors}</p>
                  <div style={styles.itemMeta}>★ {book.average_rating || '4.0'}</div>
                </div>
                <button
                  style={styles.removeBtn}
                  onClick={() => onRemove(book)}
                  title="Remove from saved list"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  drawer: {
    backgroundColor: '#faf4e8',
    borderLeft: '2px solid #7a3e1d',
    width: '100%',
    maxWidth: '420px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-8px 0 24px rgba(30, 18, 14, 0.3)',
    position: 'relative',
    animation: 'slideIn 0.25s ease-out',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e6d8c5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6efe2',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    backgroundColor: '#7a3e1d',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6c544a',
    cursor: 'pointer',
  },
  actionBanner: {
    padding: '16px',
    borderBottom: '1px solid #e6d8c5',
    backgroundColor: '#faf4e8',
  },
  list: {
    padding: '16px',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  itemCard: {
    backgroundColor: '#f6efe2',
    border: '1px solid #e4d5c1',
    borderRadius: '10px',
    padding: '10px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  itemImg: {
    width: '45px',
    height: '65px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '0.88rem',
    margin: '0 0 2px 0',
    color: '#2c1a14',
    cursor: 'pointer',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  itemAuthor: {
    fontSize: '0.78rem',
    color: '#6c544a',
    margin: 0,
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: '#7a3e1d',
    fontWeight: '700',
    marginTop: '4px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#9e877c',
    cursor: 'pointer',
    padding: '6px',
  },
};
