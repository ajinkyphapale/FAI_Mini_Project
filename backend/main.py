"""
FastAPI Main Application
Serves RESTful endpoints for catalog searching, filtering, hybrid recommendation algorithms,
and Gemini AI explanations. Auto-generates interactive API docs at /docs.
"""

from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Local application imports
from data_loader import data_loader_instance
from hybrid import hybrid_recommender_instance
import gemini_service

app = FastAPI(
    title="AI-Based Library Book Recommendation System",
    description="FAI Mini Project - Hybrid Content + Collaborative + Gemini LLM Recommender API",
    version="1.0.0"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for API Requests
class RecommendByBookRequest(BaseModel):
    book_id: int = Field(..., description="Target seed book ID")
    top_n: Optional[int] = Field(10, ge=1, le=50, description="Number of recommendations to return")
    alpha: Optional[float] = Field(0.5, ge=0.0, le=1.0, description="Content vs Collaborative weight ratio")

class RecommendByQuizRequest(BaseModel):
    mood: Optional[str] = Field(None, description="Current mood selected by user")
    genre: Optional[str] = Field(None, description="Preferred genre selected by user")
    favorite_book_id: Optional[int] = Field(None, description="Favorite book ID if selected")
    theme: Optional[str] = Field(None, description="Specific story theme")
    top_n: Optional[int] = Field(10, ge=1, le=50)

class RecommendByTextRequest(BaseModel):
    prompt: str = Field(..., description="Free-text recommendation query")
    top_n: Optional[int] = Field(10, ge=1, le=50)


# API Routes

@app.get("/api/health", tags=["Health"])
def health_check():
    """Returns server status and dataset loaded stats."""
    books_count = len(data_loader_instance.get_all_books())
    ratings_count = len(data_loader_instance.get_ratings())
    return {
        "status": "online",
        "dataset": {
            "total_books": books_count,
            "total_ratings": ratings_count
        },
        "gemini_active": gemini_service.GENAI_AVAILABLE
    }


@app.get("/api/genres", tags=["Metadata"])
def get_genres():
    """Returns list of popular unique genres/tags for filter dropdowns."""
    return {"genres": data_loader_instance.get_unique_genres()}


@app.get("/api/books/search", tags=["Catalog"])
def search_books(
    query: Optional[str] = Query(None, description="Search term in title, author, or tags"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    author: Optional[str] = Query(None, description="Filter by author name"),
    year_min: Optional[int] = Query(None, description="Minimum publication year"),
    year_max: Optional[int] = Query(None, description="Maximum publication year"),
    min_rating: Optional[float] = Query(None, description="Minimum average rating")
):
    """Searches library catalog with metadata filters."""
    results = hybrid_recommender_instance.search_and_filter(
        query=query,
        genre=genre,
        author=author,
        year_min=year_min,
        year_max=year_max,
        min_rating=min_rating
    )
    return {
        "total_results": len(results),
        "books": results[:50]  # Paginated limit for fast UI rendering
    }


@app.get("/api/books/{book_id}", tags=["Catalog"])
def get_book_details(book_id: int):
    """Retrieves full metadata for a specific book by ID."""
    book = data_loader_instance.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Also fetch top similar books as content recommendations
    similar_candidates = hybrid_recommender_instance.recommend_by_book(book_id, top_n=5)
    return {
        "book": book,
        "similar_books": similar_candidates
    }


@app.post("/api/recommend/by-book", tags=["Recommendations"])
def recommend_by_book(req: RecommendByBookRequest):
    """Hybrid recommendations based on a single seed book ID."""
    seed_book = data_loader_instance.get_book_by_id(req.book_id)
    if not seed_book:
        raise HTTPException(status_code=404, detail="Seed book not found")

    candidates = hybrid_recommender_instance.recommend_by_book(
        book_id=req.book_id,
        top_n=req.top_n,
        alpha=req.alpha
    )

    intent_summary = f"Similar to '{seed_book.get('title')}' by {seed_book.get('authors')}"
    enhanced_recs = gemini_service.generate_explanations(intent_summary, candidates)
    
    return {
        "seed_book": seed_book,
        "recommendations": enhanced_recs
    }


@app.post("/api/recommend/by-quiz", tags=["Recommendations"])
def recommend_by_quiz(req: RecommendByQuizRequest):
    """Hybrid recommendations based on multi-choice quiz answers."""
    quiz_dict = req.model_dump()
    candidates = hybrid_recommender_instance.recommend_by_quiz(
        quiz_answers=quiz_dict,
        top_n=req.top_n
    )

    intent_parts = []
    if req.genre: intent_parts.append(f"Genre: {req.genre}")
    if req.mood: intent_parts.append(f"Mood: {req.mood}")
    if req.theme: intent_parts.append(f"Theme: {req.theme}")
    intent_summary = ", ".join(intent_parts) if intent_parts else "Quiz selections"

    enhanced_recs = gemini_service.generate_explanations(intent_summary, candidates)
    return {
        "quiz_context": quiz_dict,
        "recommendations": enhanced_recs
    }


@app.post("/api/recommend/by-text", tags=["Recommendations"])
def recommend_by_text(req: RecommendByTextRequest):
    """Hybrid recommendations based on free-text user prompt with Gemini LLM re-ranking."""
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt string cannot be empty")

    candidates = hybrid_recommender_instance.recommend_by_text(
        text_prompt=req.prompt,
        top_n=req.top_n
    )

    enhanced_recs = gemini_service.generate_explanations(req.prompt, candidates)
    return {
        "prompt": req.prompt,
        "recommendations": enhanced_recs
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
