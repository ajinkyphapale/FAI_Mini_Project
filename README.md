# Alexandria | AI-Based Library Book Recommendation System

> **FAI Course Mini Project** • 2nd Year AI & Data Science (AI&DS) Branch  
> A full-stack web application featuring **Hybrid ML Recommendation Algorithms** (TF-IDF Content-Based + Item-Based Collaborative Filtering) and **Google Gemini LLM** grounded re-ranking with natural-language explanations.

---

## 🌟 Key Features

1. **Hybrid Recommendation Engine**
   - **Content-Based Filtering**: TF-IDF (Term Frequency - Inverse Document Frequency) vectorization on combined book attributes (`title + authors + tags/genres`) with Cosine Similarity. Solves the **Cold-Start** problem for new/unrated books.
   - **Collaborative Filtering**: Sparse item-based user rating matrix (`scipy.sparse.csr_matrix`) cosine similarity. Captures latent user taste patterns.
   - **Weighted Hybrid Scoring**: Combines content and collaborative scores using a weighted sum (`final_score = alpha * content_score + (1 - alpha) * collab_score`).

2. **Google Gemini LLM Integration**
   - Shortlists top hybrid candidates and sends them to Google Gemini LLM.
   - Gemini re-ranks candidate books and writes warm, natural-language explanations for each recommendation.
   - **Graceful Fallback**: If `GEMINI_API_KEY` is not provided, quota is reached, or offline, the system automatically uses smart pre-formulated explanations so live viva demos **never crash**.

3. **Three Interactive Recommendation Modes**
   - **Catalog Search & Metadata Filters**: Live keyword search across title/author/genres with year range and minimum rating sliders.
   - **Interactive Preference Quiz**: 4-step guided quiz (Mood, Genre, Theme, Favorite Book) feeding directly into the hybrid engine.
   - **AI Free-Text Prompt Bar**: Type natural language prompts like *"I want a dark mystery novel with a detective like Sherlock Holmes"*.

4. **Cozy Wood-Tone Library Theme**
   - Aesthetic parchment palette, mahogany accents, slab-serif typography (*Playfair Display* / *Lora*), and interactive book cards.
   - **Session-Based Favorites**: Star books during a session and generate recommendations directly based on saved favorites.

---

## 🏗️ Project Architecture

```
FAI_Mini_Project/
├── backend/
│   ├── main.py                 # FastAPI application, REST endpoints, CORS
│   ├── data_loader.py          # Loads Goodbooks-10k CSV files into pandas DataFrames
│   ├── content_based.py        # TF-IDF vectorization & Cosine Similarity logic
│   ├── collaborative.py        # Sparse user-item matrix & Collaborative Filtering
│   ├── hybrid.py               # Weighted hybrid scoring engine & search filters
│   ├── gemini_service.py       # Google Gemini LLM calls, prompt templates & fallback
│   ├── download_dataset.py     # Setup script to download/generate Goodbooks-10k CSVs
│   ├── data/                   # Dataset directory (books.csv, ratings.csv, etc.)
│   ├── .env                    # GEMINI_API_KEY configuration
│   ├── .env.example            # Environment template
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Header, SearchBar, BookCard, QuizModal, FreeTextSearch, etc.
│   │   ├── services/           # api.js REST API client wrapper
│   │   ├── styles/             # theme.css (cozy library design tokens)
│   │   ├── App.jsx             # Main React application component
│   │   └── main.jsx            # Vite entry point
│   ├── index.html              # HTML template with Google Fonts
│   ├── package.json            # Node.js frontend dependencies
│   └── vite.config.js          # Vite config with API proxy to FastAPI
└── README.md                   # Setup guide and Viva Q&A
```

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Python 3.9+ installed
- Node.js 16+ and `npm` installed

---

### Step 1: Backend Setup (FastAPI)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd FAI_Mini_Project
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell/CMD):**
     ```powershell
     python -m venv backend/venv
     backend\venv\Scripts\activate
     ```
   - **Linux/macOS:**
     ```bash
     python3 -m venv backend/venv
     source backend/venv/bin/activate
     ```

3. Install backend Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Initialize the dataset:
   ```bash
   python backend/download_dataset.py
   ```
   *(This downloads Goodbooks-10k CSVs into `backend/data/` or generates a rich local dataset out-of-the-box).*

5. *(Optional)* Configure your Google Gemini API Key:
   - Copy `.env.example` to `.env` in `backend/`:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Edit `backend/.env` and insert your Gemini API Key from [Google AI Studio](https://aistudio.google.com/):
     ```env
     GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere
     ```
   *(Note: If you leave this empty, the system will use smart local fallback explanations seamlessly).*

6. Start the FastAPI backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
   Backend will run on `http://127.0.0.1:8000`. You can test API docs live at `http://127.0.0.1:8000/docs`.

---

### Step 2: Frontend Setup (React + Vite)

1. Open a **second terminal** and navigate to `frontend/`:
   ```bash
   cd FAI_Mini_Project/frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 🎓 Viva Questions & Answers (Faculty Demo Guide)

### Q1: What is the Cold-Start problem in recommendation systems and how did you address it?
> **Answer:** The Cold-Start problem occurs when a new item (or new user) enters the system with zero rating history, making collaborative filtering unusable for that item. We addressed this by implementing **Content-Based Filtering (TF-IDF)** on book titles, authors, and genres. Content-based algorithms recommend items based on attribute similarity rather than user rating history.

### Q2: How does your Hybrid Recommendation Engine combine Content-Based and Collaborative scores?
> **Answer:** We use a **Weighted Hybrid approach**:
> $$\text{Final Score} = \alpha \cdot S_{\text{content}} + (1 - \alpha) \cdot S_{\text{collab}}$$
> Where $S_{\text{content}}$ is the TF-IDF Cosine Similarity score, $S_{\text{collab}}$ is the Item-Based Sparse Matrix Cosine Similarity score, and $\alpha$ is a tunable weight constant (defaulting to 0.5).

### Q3: Why did you use TF-IDF instead of simple word counting?
> **Answer:** TF-IDF (Term Frequency - Inverse Document Frequency) downweights common words that appear frequently across all books (like "book", "edition", "story") and gives higher mathematical weight to unique, highly descriptive genre/topic terms (like "dystopian", "courtroom", "cyberpunk"), leading to much cleaner cosine similarity vectors.

### Q4: Why is Gemini used for re-ranking rather than generating recommendations directly?
> **Answer:** LLMs can suffer from hallucinations if asked to recommend books directly without constraints. In our pipeline, our ML hybrid engine shortlists 10 real candidate books grounded in the Goodbooks-10k dataset. Gemini is then passed this shortlist to re-rank the candidates and generate warm, natural-language explanations explaining *why* each book was chosen.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend & dataset initialization status |
| `GET` | `/api/genres` | List unique genres for filter dropdowns |
| `GET` | `/api/books/search` | Search catalog by title/author/genre/year/rating |
| `GET` | `/api/books/{book_id}` | Fetch book details + 5 similar book recommendations |
| `POST` | `/api/recommend/by-book` | Hybrid recommendations seed from a book ID |
| `POST` | `/api/recommend/by-quiz` | Recommendations based on multi-choice quiz choices |
| `POST` | `/api/recommend/by-text` | Free-text AI prompt recommendations with Gemini reasons |

---

## 📜 License & Credits
Built for college FAI Mini Project demo. Dataset sourced from Goodbooks-10k.