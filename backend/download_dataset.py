"""
Dataset Setup Script for FAI Mini Project
Downloads the Goodbooks-10k dataset files into backend/data/ or generates
a curated sample dataset if network downloads are unavailable.
"""

import os
import requests
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
RAW_BASE_URL = "https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/"

FILES = ["books.csv", "ratings.csv", "book_tags.csv", "tags.csv"]

SAMPLE_BOOKS = [
    {
        "book_id": 1, "goodreads_book_id": 2767052, "best_book_id": 2767052, "work_id": 2792775,
        "books_count": 274, "isbn": "439023483", "isbn13": 9780439023480, "authors": "Suzanne Collins",
        "original_publication_year": 2008, "original_title": "The Hunger Games",
        "title": "The Hunger Games (The Hunger Games, #1)", "language_code": "eng", "average_rating": 4.34,
        "ratings_count": 4780653, "work_ratings_count": 4942365, "work_text_reviews_count": 155254,
        "ratings_1": 66715, "ratings_2": 127936, "ratings_3": 560092, "ratings_4": 1481305, "ratings_5": 2706317,
        "image_url": "https://images.gr-assets.com/books/1447303603l/2767052.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1447303603s/2767052.jpg",
        "tags": "dystopian, young-adult, fiction, action, survival, sci-fi"
    },
    {
        "book_id": 2, "goodreads_book_id": 3, "best_book_id": 3, "work_id": 4640799,
        "books_count": 491, "isbn": "439554934", "isbn13": 9780439554930, "authors": "J.K. Rowling, Mary GrandPré",
        "original_publication_year": 1997, "original_title": "Harry Potter and the Philosopher's Stone",
        "title": "Harry Potter and the Sorcerer's Stone (Harry Potter, #1)", "language_code": "eng", "average_rating": 4.44,
        "ratings_count": 4602479, "work_ratings_count": 4800065, "work_text_reviews_count": 75867,
        "ratings_1": 75504, "ratings_2": 101676, "ratings_3": 455024, "ratings_4": 1156318, "ratings_5": 3011543,
        "image_url": "https://images.gr-assets.com/books/1474154022l/3.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1474154022s/3.jpg",
        "tags": "fantasy, magic, young-adult, adventure, fiction, wizards"
    },
    {
        "book_id": 3, "goodreads_book_id": 41865, "best_book_id": 41865, "work_id": 3212258,
        "books_count": 226, "isbn": "316015849", "isbn13": 9780316015840, "authors": "Stephenie Meyer",
        "original_publication_year": 2005, "original_title": "Twilight",
        "title": "Twilight (Twilight, #1)", "language_code": "en-US", "average_rating": 3.57,
        "ratings_count": 3866839, "work_ratings_count": 3957100, "work_text_reviews_count": 95009,
        "ratings_1": 456191, "ratings_2": 436802, "ratings_3": 793319, "ratings_4": 875073, "ratings_5": 1395715,
        "image_url": "https://images.gr-assets.com/books/1361039443l/41865.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1361039443s/41865.jpg",
        "tags": "romance, vampires, fantasy, young-adult, paranormal"
    },
    {
        "book_id": 4, "goodreads_book_id": 2657, "best_book_id": 2657, "work_id": 3275794,
        "books_count": 487, "isbn": "61120081", "isbn13": 9780061120080, "authors": "Harper Lee",
        "original_publication_year": 1960, "original_title": "To Kill a Mockingbird",
        "title": "To Kill a Mockingbird", "language_code": "eng", "average_rating": 4.25,
        "ratings_count": 3198671, "work_ratings_count": 3340842, "work_text_reviews_count": 72586,
        "ratings_1": 60427, "ratings_2": 117415, "ratings_3": 446857, "ratings_4": 1001620, "ratings_5": 1714523,
        "image_url": "https://images.gr-assets.com/books/1361975680l/2657.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1361975680s/2657.jpg",
        "tags": "classics, fiction, historical-fiction, mystery, courtroom, justice"
    },
    {
        "book_id": 5, "goodreads_book_id": 4671, "best_book_id": 4671, "work_id": 2458200,
        "books_count": 1356, "isbn": "743273567", "isbn13": 9780743273560, "authors": "F. Scott Fitzgerald",
        "original_publication_year": 1925, "original_title": "The Great Gatsby",
        "title": "The Great Gatsby", "language_code": "eng", "average_rating": 3.89,
        "ratings_count": 2683664, "work_ratings_count": 2777703, "work_text_reviews_count": 51992,
        "ratings_1": 86236, "ratings_2": 197621, "ratings_3": 606158, "ratings_4": 936012, "ratings_5": 951676,
        "image_url": "https://images.gr-assets.com/books/1490528560l/4671.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1490528560s/4671.jpg",
        "tags": "classics, fiction, romance, american-literature, 1920s, drama"
    },
    {
        "book_id": 6, "goodreads_book_id": 18135, "best_book_id": 18135, "work_id": 3356006,
        "books_count": 225, "isbn": "525478817", "isbn13": 9780525478810, "authors": "John Green",
        "original_publication_year": 2012, "original_title": "The Fault in Our Stars",
        "title": "The Fault in Our Stars", "language_code": "eng", "average_rating": 4.24,
        "ratings_count": 2346404, "work_ratings_count": 2478609, "work_text_reviews_count": 140739,
        "ratings_1": 47994, "ratings_2": 92723, "ratings_3": 327550, "ratings_4": 698471, "ratings_5": 1311871,
        "image_url": "https://images.gr-assets.com/books/1360206420l/18135.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1360206420s/18135.jpg",
        "tags": "young-adult, romance, contemporary, fiction, emotional, tragedy"
    },
    {
        "book_id": 7, "goodreads_book_id": 5907, "best_book_id": 5907, "work_id": 2824770,
        "books_count": 969, "isbn": "618346252", "isbn13": 9780618346250, "authors": "J.R.R. Tolkien",
        "original_publication_year": 1937, "original_title": "The Hobbit or There and Back Again",
        "title": "The Hobbit", "language_code": "eng", "average_rating": 4.25,
        "ratings_count": 2071616, "work_ratings_count": 2196809, "work_text_reviews_count": 37670,
        "ratings_1": 46023, "ratings_2": 76784, "ratings_3": 288649, "ratings_4": 665630, "ratings_5": 1119723,
        "image_url": "https://images.gr-assets.com/books/1372847500l/5907.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1372847500s/5907.jpg",
        "tags": "fantasy, classics, adventure, high-fantasy, fiction, dragons"
    },
    {
        "book_id": 8, "goodreads_book_id": 5107, "best_book_id": 5107, "work_id": 3036731,
        "books_count": 1138, "isbn": "316769487", "isbn13": 9780316769480, "authors": "J.D. Salinger",
        "original_publication_year": 1951, "original_title": "The Catcher in the Rye",
        "title": "The Catcher in the Rye", "language_code": "eng", "average_rating": 3.79,
        "ratings_count": 2044241, "work_ratings_count": 2118553, "work_text_reviews_count": 44920,
        "ratings_1": 109370, "ratings_2": 185520, "ratings_3": 455042, "ratings_4": 661516, "ratings_5": 707105,
        "image_url": "https://images.gr-assets.com/books/1398034300l/5107.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1398034300s/5107.jpg",
        "tags": "classics, fiction, coming-of-age, american-literature, teen"
    },
    {
        "book_id": 9, "goodreads_book_id": 960, "best_book_id": 960, "work_id": 3338963,
        "books_count": 464, "isbn": "1416524797", "isbn13": 9781416524790, "authors": "Dan Brown",
        "original_publication_year": 2003, "original_title": "The Da Vinci Code",
        "title": "The Da Vinci Code (Robert Langdon, #2)", "language_code": "eng", "average_rating": 3.81,
        "ratings_count": 1447148, "work_ratings_count": 1557292, "work_text_reviews_count": 35867,
        "ratings_1": 71345, "ratings_2": 126437, "ratings_3": 390840, "ratings_4": 535232, "ratings_5": 433438,
        "image_url": "https://images.gr-assets.com/books/1303252999l/960.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1303252999s/960.jpg",
        "tags": "mystery, thriller, fiction, conspiracy, crime, historical"
    },
    {
        "book_id": 10, "goodreads_book_id": 18879, "best_book_id": 18879, "work_id": 3204327,
        "books_count": 3350, "isbn": "679783261", "isbn13": 9780679783260, "authors": "Jane Austen",
        "original_publication_year": 1813, "original_title": "Pride and Prejudice",
        "title": "Pride and Prejudice", "language_code": "eng", "average_rating": 4.24,
        "ratings_count": 2035490, "work_ratings_count": 2191465, "work_text_reviews_count": 49152,
        "ratings_1": 54700, "ratings_2": 86485, "ratings_3": 284852, "ratings_4": 609755, "ratings_5": 1155673,
        "image_url": "https://images.gr-assets.com/books/1320399351l/18879.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1320399351s/18879.jpg",
        "tags": "classics, romance, fiction, historical-fiction, Regency, drama"
    },
    {
        "book_id": 11, "goodreads_book_id": 15722288, "best_book_id": 15722288, "work_id": 21480746,
        "books_count": 164, "isbn": "30758836X", "isbn13": 9780307588360, "authors": "Gillian Flynn",
        "original_publication_year": 2012, "original_title": "Gone Girl",
        "title": "Gone Girl", "language_code": "eng", "average_rating": 4.03,
        "ratings_count": 1579801, "work_ratings_count": 1726048, "work_text_reviews_count": 121614,
        "ratings_1": 38884, "ratings_2": 80759, "ratings_3": 280804, "ratings_4": 615084, "ratings_5": 710517,
        "image_url": "https://images.gr-assets.com/books/1339608769l/15722288.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1339608769s/15722288.jpg",
        "tags": "mystery, thriller, crime, psychological-thriller, suspense"
    },
    {
        "book_id": 12, "goodreads_book_id": 40961427, "best_book_id": 40961427, "work_id": 63884358,
        "books_count": 120, "isbn": "0735219095", "isbn13": 9780735219090, "authors": "Delia Owens",
        "original_publication_year": 2018, "original_title": "Where the Crawdads Sing",
        "title": "Where the Crawdads Sing", "language_code": "eng", "average_rating": 4.45,
        "ratings_count": 1200000, "work_ratings_count": 1300000, "work_text_reviews_count": 95000,
        "ratings_1": 15000, "ratings_2": 35000, "ratings_3": 120000, "ratings_4": 410000, "ratings_5": 720000,
        "image_url": "https://images.gr-assets.com/books/1582135294l/40961427.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1582135294s/40961427.jpg",
        "tags": "fiction, mystery, nature, historical-fiction, coming-of-age"
    },
    {
        "book_id": 13, "goodreads_book_id": 24200, "best_book_id": 24200, "work_id": 3131217,
        "books_count": 105, "isbn": "0345391802", "isbn13": 9780345391803, "authors": "Douglas Adams",
        "original_publication_year": 1979, "original_title": "The Hitchhiker's Guide to the Galaxy",
        "title": "The Hitchhiker's Guide to the Galaxy", "language_code": "eng", "average_rating": 4.22,
        "ratings_count": 1100000, "work_ratings_count": 1180000, "work_text_reviews_count": 28000,
        "ratings_1": 20000, "ratings_2": 45000, "ratings_3": 150000, "ratings_4": 380000, "ratings_5": 585000,
        "image_url": "https://images.gr-assets.com/books/1531891848l/24200.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1531891848s/24200.jpg",
        "tags": "sci-fi, science-fiction, humor, comedy, space, classics"
    },
    {
        "book_id": 14, "goodreads_book_id": 119879, "best_book_id": 119879, "work_id": 115372,
        "books_count": 89, "isbn": "0441172717", "isbn13": 9780441172719, "authors": "Frank Herbert",
        "original_publication_year": 1965, "original_title": "Dune",
        "title": "Dune (Dune #1)", "language_code": "eng", "average_rating": 4.26,
        "ratings_count": 950000, "work_ratings_count": 1020000, "work_text_reviews_count": 34000,
        "ratings_1": 22000, "ratings_2": 41000, "ratings_3": 130000, "ratings_4": 320000, "ratings_5": 507000,
        "image_url": "https://images.gr-assets.com/books/1555447414l/119879.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1555447414s/119879.jpg",
        "tags": "sci-fi, science-fiction, fantasy, classics, space-opera, epic"
    },
    {
        "book_id": 15, "goodreads_book_id": 86695, "best_book_id": 86695, "work_id": 1118549,
        "books_count": 312, "isbn": "0385504209", "isbn13": 9780385504201, "authors": "Dan Brown",
        "original_publication_year": 2000, "original_title": "Angels & Demons",
        "title": "Angels & Demons (Robert Langdon, #1)", "language_code": "eng", "average_rating": 3.91,
        "ratings_count": 2200000, "work_ratings_count": 2300000, "work_text_reviews_count": 28000,
        "ratings_1": 60000, "ratings_2": 150000, "ratings_3": 550000, "ratings_4": 850000, "ratings_5": 690000,
        "image_url": "https://images.gr-assets.com/books/1358268582l/86695.jpg",
        "small_image_url": "https://images.gr-assets.com/books/1358268582s/86695.jpg",
        "tags": "mystery, thriller, fiction, conspiracy, science, religion"
    }
]

def generate_sample_dataset():
    """Generates a rich, realistic sample dataset if downloading is skipped or fails."""
    print("Generating local dataset in backend/data/...")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # 1. Create books.csv
    books_df = pd.DataFrame(SAMPLE_BOOKS)
    # Extract tags column for separate processing
    tags_col = books_df.pop("tags")
    books_df.to_csv(os.path.join(DATA_DIR, "books.csv"), index=False)

    # 2. Build tags.csv & book_tags.csv
    tag_map = {}
    tag_id_counter = 1
    book_tags_list = []

    for idx, row in enumerate(SAMPLE_BOOKS):
        b_id = row["book_id"]
        book_tags = [t.strip().lower() for t in row["tags"].split(",")]
        for tag_name in book_tags:
            if tag_name not in tag_map:
                tag_map[tag_name] = tag_id_counter
                tag_id_counter += 1
            t_id = tag_map[tag_name]
            book_tags_list.append({"goodreads_book_id": row["goodreads_book_id"], "tag_id": t_id, "count": 100})

    tags_df = pd.DataFrame([{"tag_id": tid, "tag_name": tname} for tname, tid in tag_map.items()])
    tags_df.to_csv(os.path.join(DATA_DIR, "tags.csv"), index=False)

    book_tags_df = pd.DataFrame(book_tags_list)
    book_tags_df.to_csv(os.path.join(DATA_DIR, "book_tags.csv"), index=False)

    # 3. Build ratings.csv
    np.random.seed(42)
    ratings = []
    num_users = 200
    for user_id in range(1, num_users + 1):
        # Each user rates 4-8 books
        rated_books = np.random.choice(books_df["book_id"].values, size=np.random.randint(4, 9), replace=False)
        for b_id in rated_books:
            rating = np.random.choice([3, 4, 5], p=[0.2, 0.5, 0.3])
            ratings.append({"user_id": user_id, "book_id": b_id, "rating": rating})

    ratings_df = pd.DataFrame(ratings)
    ratings_df.to_csv(os.path.join(DATA_DIR, "ratings.csv"), index=False)

    print(f"Sample dataset generated successfully in '{DATA_DIR}'!")
    print(f"Generated {len(books_df)} books, {len(ratings_df)} ratings, and {len(tags_df)} tags.")

def setup_dataset():
    os.makedirs(DATA_DIR, exist_ok=True)
    missing = [f for f in FILES if not os.path.exists(os.path.join(DATA_DIR, f))]
    
    if not missing:
        print("All dataset CSV files already exist in backend/data/.")
        return

    print(f"Missing dataset files: {missing}")
    print("Attempting to download from Goodbooks-10k repository...")
    
    download_success = True
    for fname in missing:
        url = RAW_BASE_URL + fname
        file_path = os.path.join(DATA_DIR, fname)
        try:
            res = requests.get(url, timeout=10)
            if res.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(res.content)
                print(f"Successfully downloaded {fname}")
            else:
                print(f"Failed to download {fname}: HTTP status {res.status_code}")
                download_success = False
                break
        except Exception as e:
            print(f"Error downloading {fname}: {e}")
            download_success = False
            break

    if not download_success:
        print("Falling back to creating rich local dataset...")
        generate_sample_dataset()

if __name__ == "__main__":
    setup_dataset()
