/**
 * API Service Client for Alexandria AI Library System
 * Communicates with FastAPI backend endpoints.
 */

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health check');
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

export async function searchBooks(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.genre) queryParams.append('genre', params.genre);
  if (params.author) queryParams.append('author', params.author);
  if (params.year_min) queryParams.append('year_min', params.year_min);
  if (params.year_max) queryParams.append('year_max', params.year_max);
  if (params.min_rating) queryParams.append('min_rating', params.min_rating);

  const res = await fetch(`${API_BASE}/books/search?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Failed to search catalog');
  return res.json();
}

export async function fetchBookDetails(bookId) {
  const res = await fetch(`${API_BASE}/books/${bookId}`);
  if (!res.ok) throw new Error('Book not found');
  return res.json();
}

export async function recommendByBook(bookId, topN = 10, alpha = 0.5) {
  const res = await fetch(`${API_BASE}/recommend/by-book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: Number(bookId), top_n: topN, alpha }),
  });
  if (!res.ok) throw new Error('Failed to generate book recommendations');
  return res.json();
}

export async function recommendByQuiz(quizAnswers, topN = 10) {
  const res = await fetch(`${API_BASE}/recommend/by-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...quizAnswers, top_n: topN }),
  });
  if (!res.ok) throw new Error('Failed to generate quiz recommendations');
  return res.json();
}

export async function recommendByText(prompt, topN = 10) {
  const res = await fetch(`${API_BASE}/recommend/by-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, top_n: topN }),
  });
  if (!res.ok) throw new Error('Failed to generate AI recommendations');
  return res.json();
}
