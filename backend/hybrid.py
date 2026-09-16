"""
Hybrid Recommendation Engine
Combines Content-Based (TF-IDF) and Collaborative Filtering scores into a weighted final score.

Formula:
  final_score = alpha * content_score + (1 - alpha) * collab_score

Why Hybrid?
- Content-Based alone suffers from over-specialization and cannot discover serendipitous user tastes.
- Collaborative Filtering alone suffers from the Cold-Start problem (new/unrated items have zero ratings).
- Hybrid scoring offsets both weaknesses to deliver balanced, intelligent recommendations.
"""

import pandas as pd
import numpy as np
from data_loader import data_loader_instance
from content_based import content_recommender_instance
from collaborative import collab_recommender_instance

DEFAULT_ALPHA = 0.5  # Weight for content-based score (0.5 means equal weight)

class HybridRecommender:
    def __init__(self, data_loader=data_loader_instance, cb=content_recommender_instance, cf=collab_recommender_instance):
        self.data_loader = data_loader
        self.cb = cb
        self.cf = cf
        self.books_df = data_loader.get_all_books()

    def recommend_by_book(self, book_id: int, top_n: int = 10, alpha: float = DEFAULT_ALPHA):
        """
        Generates top_n recommendations based on a single seed book.
        Combines content similarity to book_id with collaborative rating similarity to book_id.
        """
        # Step 1: Calculate raw similarity scores from both models
        cb_scores = self.cb.get_similarities_by_book(book_id)
        cf_scores = self.cf.get_similarities_by_book(book_id)

        # Step 2: Combine scores using weighted sum
        hybrid_scores = (alpha * cb_scores) + ((1.0 - alpha) * cf_scores)

        # Step 3: Package into DataFrame and sort
        df_copy = self.books_df.copy()
        df_copy["content_score"] = cb_scores
        df_copy["collab_score"] = cf_scores
        df_copy["hybrid_score"] = hybrid_scores

        # Exclude the seed book itself from recommendations
        df_copy = df_copy[df_copy["book_id"] != book_id]
        
        # Sort by hybrid score descending
        df_sorted = df_copy.sort_values(by="hybrid_score", ascending=False).head(top_n)
        return df_sorted.to_dict(orient="records")

    def recommend_by_quiz(self, quiz_answers: dict, top_n: int = 10, alpha: float = DEFAULT_ALPHA):
        """
        Generates recommendations from user quiz choices.
        quiz_answers format:
          {
            "mood": "thrilling adventure",
            "genre": "fantasy",
            "favorite_book_id": 2,
            "theme": "dark magic and mystery"
          }
        """
        # Formulate query text from quiz parameters
        query_parts = []
        if quiz_answers.get("genre"):
            query_parts.append(str(quiz_answers["genre"]))
        if quiz_answers.get("mood"):
            query_parts.append(str(quiz_answers["mood"]))
        if quiz_answers.get("theme"):
            query_parts.append(str(quiz_answers["theme"]))

        text_query = " ".join(query_parts)
        cb_scores = self.cb.get_similarities_by_text(text_query)

        # If a favorite book ID was selected in the quiz, leverage collaborative scores for that book
        fav_id = quiz_answers.get("favorite_book_id")
        if fav_id and isinstance(fav_id, int):
            cf_scores = self.cf.get_similarities_by_book(fav_id)
        else:
            cf_scores = np.zeros(len(self.books_df))

        hybrid_scores = (alpha * cb_scores) + ((1.0 - alpha) * cf_scores)

        df_copy = self.books_df.copy()
        df_copy["content_score"] = cb_scores
        df_copy["collab_score"] = cf_scores
        df_copy["hybrid_score"] = hybrid_scores

        if fav_id:
            df_copy = df_copy[df_copy["book_id"] != fav_id]

        df_sorted = df_copy.sort_values(by="hybrid_score", ascending=False).head(top_n)
        return df_sorted.to_dict(orient="records")

    def recommend_by_text(self, text_prompt: str, top_n: int = 10, alpha: float = DEFAULT_ALPHA):
        """
        Generates recommendations based on a free-text user prompt (e.g. 'I want a sci-fi space opera').
        """
        cb_scores = self.cb.get_similarities_by_text(text_prompt)
        
        # Free-text doesn't have an explicit user rating vector, so content score carries primary weight
        # or we blend with average high-rating bias
        rating_boost = (self.books_df["average_rating"] / 5.0).values
        hybrid_scores = (0.75 * cb_scores) + (0.25 * rating_boost)

        df_copy = self.books_df.copy()
        df_copy["content_score"] = cb_scores
        df_copy["collab_score"] = 0.0
        df_copy["hybrid_score"] = hybrid_scores

        df_sorted = df_copy.sort_values(by="hybrid_score", ascending=False).head(top_n)
        return df_sorted.to_dict(orient="records")

    def search_and_filter(self, query: str = "", genre: str = "", author: str = "", year_min: int = None, year_max: int = None, min_rating: float = None):
        """
        Performs fast metadata filtering and text search across the library catalog.
        """
        df = self.books_df.copy()

        if query and query.strip():
            q = query.strip().lower()
            df = df[
                df["title"].str.lower().str.contains(q) |
                df["authors"].str.lower().str.contains(q) |
                df["tag_name"].str.lower().str.contains(q)
            ]

        if genre and genre.strip():
            g = genre.strip().lower()
            df = df[df["tag_name"].str.lower().str.contains(g)]

        if author and author.strip():
            a = author.strip().lower()
            df = df[df["authors"].str.lower().str.contains(a)]

        if year_min is not None:
            df = df[df["original_publication_year"] >= year_min]

        if year_max is not None:
            df = df[df["original_publication_year"] <= year_max]

        if min_rating is not None:
            df = df[df["average_rating"] >= min_rating]

        return df.to_dict(orient="records")

# Global instance for API consumption
hybrid_recommender_instance = HybridRecommender()
