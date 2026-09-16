"""
Collaborative Filtering Recommendation Engine
Implements Item-Based Collaborative Filtering using scipy sparse user-item rating matrices
and Cosine Similarity across rating profiles.

Why Collaborative Filtering?
Unlike Content-Based, Collaborative Filtering captures latent user taste patterns (e.g., users who liked X also liked Y)
regardless of whether X and Y share the same genre tags.
"""

import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity
from data_loader import data_loader_instance

class CollaborativeRecommender:
    def __init__(self, data_loader=data_loader_instance):
        self.data_loader = data_loader
        self.books_df = data_loader.get_all_books()
        self.ratings_df = data_loader.get_ratings()
        self.item_sim_matrix = None
        self.book_id_to_col = {}
        self.col_to_book_id = {}
        self.build_model()

    def build_model(self):
        """Builds user-item sparse rating matrix and calculates item-item cosine similarity."""
        print("Building Collaborative Filtering model...")
        num_books = len(self.books_df)
        
        # Build mapping between book_id and matrix column index
        for idx, book_id in enumerate(self.books_df["book_id"]):
            self.book_id_to_col[book_id] = idx
            self.col_to_book_id[idx] = book_id

        if self.ratings_df.empty:
            print("Ratings dataset empty. Collaborative scores will fallback to 0.")
            self.item_sim_matrix = np.zeros((num_books, num_books))
            return

        # Filter ratings for books present in books_df
        valid_ratings = self.ratings_df[self.ratings_df["book_id"].isin(self.book_id_to_col.keys())]
        
        if valid_ratings.empty:
            self.item_sim_matrix = np.zeros((num_books, num_books))
            return

        # Map user_id to dense user index
        user_ids = valid_ratings["user_id"].unique()
        user_to_row = {uid: i for i, uid in enumerate(user_ids)}
        
        rows = valid_ratings["user_id"].map(user_to_row).values
        cols = valid_ratings["book_id"].map(self.book_id_to_col).values
        data = valid_ratings["rating"].values

        # Build Sparse Matrix (users x items)
        user_item_matrix = csr_matrix((data, (rows, cols)), shape=(len(user_ids), num_books))
        
        # Calculate Item-Item Similarity (transpose to items x users)
        item_matrix = user_item_matrix.T
        self.item_sim_matrix = cosine_similarity(item_matrix, item_matrix)
        print("Collaborative Filtering model fit complete.")

    def get_similarities_by_book(self, book_id: int) -> np.ndarray:
        """
        Given a book_id, returns collaborative similarity scores across all books.
        """
        if book_id not in self.book_id_to_col or self.item_sim_matrix is None:
            return np.zeros(len(self.books_df))

        col_idx = self.book_id_to_col[book_id]
        return self.item_sim_matrix[col_idx]

    def get_similarities_for_multiple_books(self, book_ids: list) -> np.ndarray:
        """
        Given a list of seed book_ids (e.g. user favorites or quiz choices),
        averages collaborative similarity profiles.
        """
        if not book_ids or self.item_sim_matrix is None:
            return np.zeros(len(self.books_df))

        valid_cols = [self.book_id_to_col[b] for b in book_ids if b in self.book_id_to_col]
        if not valid_cols:
            return np.zeros(len(self.books_df))

        scores = self.item_sim_matrix[valid_cols].mean(axis=0)
        return scores

# Global instance for recommendation queries
collab_recommender_instance = CollaborativeRecommender()
