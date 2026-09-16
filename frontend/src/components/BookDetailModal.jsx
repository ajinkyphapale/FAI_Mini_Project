import React, { useState, useEffect } from 'react';
import { X, Star, BookOpen, Calendar, Tag, Sparkles } from 'lucide-react';
import { fetchBookDetails } from '../services/api';

export default function BookDetailModal({ bookId, onClose, onSelectBook, onToggleFavorite, isFavorite }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      setLoading(true);
      fetchBookDetails(bookId)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [bookId]);

  if (!bookId) return null;

  return (
    <div className="modal-overlay">
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7a3e1d' }}>
            <p>Retrieving book records from library archive...</p>
          </div>
        ) : data && data.book ? (
          <div>
            <div style={styles.heroSection}>
              {/* Cover Art */}
              <div style={styles.imgContainer}>
                <img
                  src={data.book.image_url}
                  alt={data.book.title}
                  style={styles.coverImg}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.gr-assets.com/books/1447303603l/2767052.jpg';
                  }}
                />
              </div>

              {/* Details Info */}
              <div style={styles.infoContainer}>
                <div style={styles.ratingBadge}>
                  <Star size={16} fill="#c69214" color="#c69214" />
                  <span>{data.book.average_rating} / 5.0</span>
                  <span style={styles.ratingsCount}>({data.book.ratings_count?.toLocaleString()} ratings)</span>
                </div>

                <h2 style={styles.title}>{data.book.title}</h2>
                <p style={styles.authors}>By {data.book.authors}</p>

                <div style={styles.metaGrid}>
                  <div>
                    <span style={styles.metaLabel}>Publication Year</span>
                    <div style={styles.metaValue}>{data.book.original_publication_year || 'Unknown'}</div>
                  </div>
                  <div>
                    <span style={styles.metaLabel}>ISBN Code</span>
                    <div style={styles.metaValue}>{data.book.isbn || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={styles.metaLabel}>Language</span>
                    <div style={styles.metaValue}>{data.book.language_code || 'eng'}</div>
                  </div>
                </div>

                <div style={styles.favSection}>
                  <button
                    className="btn-primary"
                    onClick={() => onToggleFavorite(data.book)}
                    style={{
                      backgroundColor: isFavorite ? '#691a18' : '#7a3e1d',
                    }}
                  >
                    <Star size={18} fill={isFavorite ? '#ffffff' : 'none'} />
                    <span>{isFavorite ? 'Saved in Favorites' : 'Save Book to Favorites'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags / Genres */}
            {data.book.tag_name && (
              <div style={styles.tagsSection}>
                <h4 style={styles.sectionHeading}>
                  <Tag size={16} color="#7a3e1d" />
                  <span>Genres & Associated Tags</span>
                </h4>
                <div style={styles.tagsContainer}>
                  {String(data.book.tag_name).split(' ').map((t, idx) => (
                    <span key={idx} className="badge-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Book Recommendations */}
            {data.similar_books && data.similar_books.length > 0 && (
              <div style={styles.similarSection}>
                <h4 style={styles.sectionHeading}>
                  <BookOpen size={16} color="#7a3e1d" />
                  <span>Similar Books in Catalog (Hybrid Similarity)</span>
                </h4>
                <div style={styles.similarGrid}>
                  {data.similar_books.map((b) => (
                    <div
                      key={b.book_id}
                      style={styles.similarCard}
                      onClick={() => onSelectBook(b)}
                    >
                      <img
                        src={b.image_url}
                        alt={b.title}
                        style={styles.similarImg}
                      />
                      <div>
                        <div style={styles.similarTitle}>{b.title}</div>
                        <div style={styles.similarAuthor}>{b.authors}</div>
                        <div style={{ fontSize: '0.72rem', color: '#7a3e1d', marginTop: '4px' }}>
                          ★ {b.average_rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Book metadata not found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  modal: {
    backgroundColor: '#faf4e8',
    border: '2px solid #7a3e1d',
    borderRadius: '16px',
    maxWidth: '750px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
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
  heroSection: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  imgContainer: {
    width: '140px',
    height: '200px',
    backgroundColor: '#382219',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  },
  coverImg: {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
  },
  infoContainer: {
    flex: 1,
    minWidth: '240px',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '700',
    color: '#7a3e1d',
    fontSize: '0.95rem',
    marginBottom: '6px',
  },
  ratingsCount: {
    fontSize: '0.8rem',
    color: '#9e877c',
    fontWeight: 'normal',
  },
  title: {
    fontSize: '1.4rem',
    color: '#2c1a14',
    margin: '0 0 6px 0',
  },
  authors: {
    fontSize: '0.95rem',
    color: '#6c544a',
    margin: '0 0 16px 0',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    backgroundColor: '#f6efe2',
    border: '1px solid #e4d5c1',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '16px',
  },
  metaLabel: {
    fontSize: '0.72rem',
    color: '#9e877c',
    display: 'block',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#2c1a14',
  },
  favSection: {
    marginTop: '12px',
  },
  tagsSection: {
    borderTop: '1px solid #e6d8c5',
    paddingTop: '16px',
    marginBottom: '20px',
  },
  sectionHeading: {
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#7a3e1d',
    marginBottom: '10px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  similarSection: {
    borderTop: '1px solid #e6d8c5',
    paddingTop: '16px',
  },
  similarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  similarCard: {
    backgroundColor: '#f6efe2',
    border: '1px solid #e4d5c1',
    borderRadius: '10px',
    padding: '10px',
    display: 'flex',
    gap: '10px',
    cursor: 'pointer',
  },
  similarImg: {
    width: '45px',
    height: '65px',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  similarTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2c1a14',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  similarAuthor: {
    fontSize: '0.75rem',
    color: '#6c544a',
  },
};
