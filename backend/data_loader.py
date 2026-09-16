"""
Data Loader Module for FAI Mini Project
Loads Goodbooks-10k CSV files from backend/data/ into pandas DataFrames at server startup.
Performs data cleaning, merging book tags/genres, and building combined feature representations.
"""

import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

class DataLoader:
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        self.books_df = None
        self.ratings_df = None
        self.book_tags_df = None
        self.tags_df = None
        self.book_tags_merged = None
        self.load_data()

    def load_data(self):
        """Loads CSV datasets into pandas DataFrames and prepares merged feature strings."""
        books_path = os.path.join(self.data_dir, "books.csv")
        ratings_path = os.path.join(self.data_dir, "ratings.csv")
        book_tags_path = os.path.join(self.data_dir, "book_tags.csv")
        tags_path = os.path.join(self.data_dir, "tags.csv")

        # Fallback if files don't exist
        if not os.path.exists(books_path):
            from download_dataset import setup_dataset
            setup_dataset()

        print("Loading CSV datasets into memory...")
        self.books_df = pd.read_csv(books_path)
        self.ratings_df = pd.read_csv(ratings_path) if os.path.exists(ratings_path) else pd.DataFrame()
        self.book_tags_df = pd.read_csv(book_tags_path) if os.path.exists(book_tags_path) else pd.DataFrame()
        self.tags_df = pd.read_csv(tags_path) if os.path.exists(tags_path) else pd.DataFrame()

        # Clean books_df missing values
        self.books_df["authors"] = self.books_df["authors"].fillna("Unknown Author")
        self.books_df["title"] = self.books_df["title"].fillna("Untitled Book")
        self.books_df["original_title"] = self.books_df["original_title"].fillna(self.books_df["title"])
        self.books_df["average_rating"] = self.books_df["average_rating"].fillna(4.0)
        self.books_df["original_publication_year"] = self.books_df["original_publication_year"].fillna(2000).astype(int)
        self.books_df["image_url"] = self.books_df["image_url"].fillna("https://via.placeholder.com/150x220?text=No+Cover")

        # Process Tags/Genres mapping
        if not self.book_tags_df.empty and not self.tags_df.empty:
            # Merge book_tags with tags
            merged_tags = pd.merge(self.book_tags_df, self.tags_df, on="tag_id", how="inner")
            # Group tags by goodreads_book_id
            tags_by_book = (
                merged_tags.groupby("goodreads_book_id")["tag_name"]
                .apply(lambda x: " ".join(x.dropna().astype(str)))
                .reset_index()
            )
            # Merge back into books_df
            self.books_df = pd.merge(
                self.books_df, tags_by_book, on="goodreads_book_id", how="left"
            )
            self.books_df["tag_name"] = self.books_df["tag_name"].fillna("")
        else:
            self.books_df["tag_name"] = ""

        # Create combined content feature string for TF-IDF vectorizer
        # Formula: title + authors + tags/genres
        self.books_df["content_features"] = (
            self.books_df["title"].astype(str) + " " +
            self.books_df["authors"].astype(str) + " " +
            self.books_df["tag_name"].astype(str)
        ).str.lower()

        print(f"Data loading complete! {len(self.books_df)} books loaded successfully.")

    def get_all_books(self):
        """Returns full books DataFrame."""
        return self.books_df

    def get_ratings(self):
        """Returns user ratings DataFrame."""
        return self.ratings_df

    def get_book_by_id(self, book_id: int):
        """Finds a single book record by book_id."""
        row = self.books_df[self.books_df["book_id"] == book_id]
        if not row.empty:
            return row.iloc[0].to_dict()
        return None

    def get_unique_genres(self):
        """Extracts top unique genre keywords from tags."""
        if not self.tags_df.empty:
            # Pick clean tag names without numbers or spaces
            popular_tags = self.tags_df["tag_name"].str.lower().unique()
            common_genres = [
                "fantasy", "fiction", "young-adult", "classics", "romance",
                "mystery", "thriller", "sci-fi", "science-fiction", "history",
                "adventure", "paranormal", "dystopian", "historical-fiction"
            ]
            found = [g for g in common_genres if g in popular_tags]
            return found if found else common_genres
        return ["fantasy", "fiction", "romance", "mystery", "thriller", "sci-fi", "classics"]

# Global singleton instance for easy import across modules
data_loader_instance = DataLoader()
