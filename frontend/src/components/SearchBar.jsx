import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Filter } from 'lucide-react';

export default function SearchBar({ genres, onSearch, onReset }) {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query,
      genre: selectedGenre,
      author,
      year_min: yearMin ? Number(yearMin) : null,
      year_max: yearMax ? Number(yearMax) : null,
      min_rating: minRating ? Number(minRating) : null,
    });
  };

  const handleReset = () => {
    setQuery('');
    setSelectedGenre('');
    setAuthor('');
    setYearMin('');
    setYearMax('');
    setMinRating('');
    onReset();
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Main Search Bar */}
        <div style={styles.inputGroup}>
          <Search size={20} color="#7a3e1d" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title, author, or keyword (e.g. Harry Potter, Tolkien, Mystery)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" className="btn-primary">
            Search Catalog
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: showFilters ? '#f1e6d4' : undefined,
              borderColor: showFilters ? '#7a3e1d' : undefined,
            }}
          >
            <SlidersHorizontal size={18} color="#7a3e1d" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div style={styles.filterDrawer}>
            <div style={styles.filterHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} color="#7a3e1d" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Refine Catalog Results</h4>
              </div>
              <button type="button" onClick={handleReset} style={styles.resetBtn}>
                <RotateCcw size={14} /> Clear All
              </button>
            </div>

            <div style={styles.filterGrid}>
              {/* Genre Filter */}
              <div>
                <label style={styles.label}>Genre / Category</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Genres</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <label style={styles.label}>Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stephen King"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={styles.input}
                />
              </div>

              {/* Year Min/Max */}
              <div>
                <label style={styles.label}>Publication Year Range</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="Min (1800)"
                    value={yearMin}
                    onChange={(e) => setYearMin(e.target.value)}
                    style={{ ...styles.input, width: '50%' }}
                  />
                  <input
                    type="number"
                    placeholder="Max (2024)"
                    value={yearMax}
                    onChange={(e) => setYearMax(e.target.value)}
                    style={{ ...styles.input, width: '50%' }}
                  />
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label style={styles.label}>Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">★ 4.5+ (Highest Rated)</option>
                  <option value="4.0">★ 4.0+ (Very Popular)</option>
                  <option value="3.5">★ 3.5+ (Good)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f6efe2',
    border: '1px solid #e4d5c1',
    borderRadius: '16px',
    padding: '16px 20px',
    boxShadow: '0 4px 16px rgba(44, 26, 20, 0.06)',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    flexWrap: 'wrap',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
  },
  searchInput: {
    flex: 1,
    minWidth: '260px',
    padding: '12px 14px 12px 44px',
    borderRadius: '10px',
    border: '1px solid #d9c7b1',
    backgroundColor: '#ffffff',
    fontSize: '0.98rem',
    color: '#2c1a14',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  filterDrawer: {
    backgroundColor: '#faf4e8',
    border: '1px solid #d8b871',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '6px',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e6d8c5',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: '#6c544a',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '500',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#6c544a',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d9c7b1',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d9c7b1',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
    color: '#2c1a14',
  },
};
