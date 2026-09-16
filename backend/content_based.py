"""
Content-Based Recommendation Engine
Uses TF-IDF (Term Frequency - Inverse Document Frequency) vectorization on book metadata
(title + authors + tags/genres) and computes Cosine Similarity between books or text queries.

Why Content-Based?
It solves the Cold-Start problem for new/unrated books because it relies purely on textual attributes.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from data_loader import data_loader_instance

class ContentBasedRecommender:
    def __init__(self, data_loader=data_loader_instance):
        self.data_loader = data_loader
        self.books_df = data_loader.get_all_books()
        self.vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        self.tfidf_matrix = None
        self.cosine_sim_matrix = None
        self.book_id_to_idx = {}
        self.idx_to_book_id = {}
        self.build_model()

    def build_model(self):
        """Constructs TF-IDF feature matrix and precomputes item-item cosine similarity matrix."""
        print("Building Content-Based TF-IDF vectorizer...")
        corpus = self.books_df["content_features"].tolist()
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        
        # Build index lookup maps
        for idx, book_id in enumerate(self.books_df["book_id"]):
            self.book_id_to_idx[book_id] = idx
            self.idx_to_book_id[idx] = book_id

        # Precompute item similarity matrix
        self.cosine_sim_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        print("Content-Based model fit complete.")

    def get_similarities_by_book(self, book_id: int) -> np.ndarray:
        """
        Given a target book_id, returns an array of cosine similarity scores (0.0 to 1.0)
        aligned with books_df rows.
        """
        if book_id not in self.book_id_to_idx:
            return np.zeros(len(self.books_df))
        
        idx = self.book_id_to_idx[book_id]
        return self.cosine_sim_matrix[idx]

    def get_similarities_by_text(self, text_query: str) -> np.ndarray:
        """
        Given a natural language string query (e.g. 'dark mystery novel with wizards'),
        transforms query into TF-IDF vector space and calculates Cosine Similarity against all books.
        """
        if not text_query or not text_query.strip():
            return np.zeros(len(self.books_df))

        query_vec = self.vectorizer.transform([text_query.lower()])
        sim_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        return sim_scores

# Global instance for recommendation queries
content_recommender_instance = ContentBasedRecommender()
