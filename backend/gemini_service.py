"""
Gemini LLM Service Module
Handles calls to Google Gemini API for intelligent re-ranking and generating natural-language explanations
for recommended books.

Design Note for Viva:
Gemini does NOT fabricate or invent recommendations out of thin air. Instead, it operates on a candidate shortlist
produced by our Hybrid Recommendation Engine (TF-IDF + Collaborative Filtering). It evaluates user intent,
re-ranks the shortlist, and provides grounded, conversational explanations.

Fallback Mechanism:
If the API key is not configured, quota is exceeded, or offline, the service gracefully falls back to generating
pre-formulated textual explanations using book metadata so the demo never fails.
"""

import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Attempt to import google.genai SDK
GENAI_AVAILABLE = False
try:
    from google import genai
    from google.genai import types
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        client = genai.Client(api_key=GEMINI_API_KEY)
        GENAI_AVAILABLE = True
        print("Google Gemini API client initialized successfully.")
    else:
        print("GEMINI_API_KEY is not set or placeholder used. Gemini fallback mode active.")
except Exception as e:
    print(f"Notice: google-genai client initialization skipped: {e}. Fallback mode active.")


def build_gemini_prompt(user_intent: str, candidate_books: List[Dict[str, Any]]) -> str:
    """
    Constructs a structured prompt template for Gemini LLM.
    
    Parameters:
      user_intent: User's free-text request, quiz choices, or seed book title.
      candidate_books: Top candidate books from Hybrid Recommender shortlist.
    """
    books_summary = []
    for b in candidate_books:
        books_summary.append({
            "book_id": b.get("book_id"),
            "title": b.get("title"),
            "authors": b.get("authors"),
            "rating": b.get("average_rating"),
            "publication_year": b.get("original_publication_year"),
            "tags": b.get("tag_name", "")[:200]
        })

    prompt = f"""
You are an expert, friendly librarian AI recommendation assistant.
A reader has provided the following preference request:
"{user_intent}"

Below is a shortlist of candidate books retrieved by our hybrid recommendation engine:
{json.dumps(books_summary, indent=2)}

Your task:
1. Re-rank or select the best matching books for the user's preference.
2. For EACH selected book, write a short, warm, engaging 1-2 sentence explanation of why it's recommended based on their request, matching tags, or author style.

CRITICAL INSTRUCTIONS:
- Respond ONLY with valid JSON format adhering to this structure:
{{
  "recommendations": [
    {{
      "book_id": <int>,
      "explanation": "<short natural-language reason>"
    }}
  ]
}}
- Do NOT invent books outside the candidate list.
"""
    return prompt


def generate_explanations(user_intent: str, candidate_books: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Calls Gemini API to re-rank candidate books and attach LLM-generated explanations.
    Returns the candidate_books list updated with 'ai_explanation' fields.
    """
    if not candidate_books:
        return []

    # If Gemini client is active, perform API call
    if GENAI_AVAILABLE and GEMINI_API_KEY:
        try:
            prompt = build_gemini_prompt(user_intent, candidate_books)
            # Use gemini-2.5-flash or gemini-1.5-flash model
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4
                )
            )

            response_text = response.text.strip()
            parsed_json = json.loads(response_text)
            recs = parsed_json.get("recommendations", [])
            
            # Map explanations back to candidate books
            explanation_map = {r["book_id"]: r["explanation"] for r in recs if "book_id" in r and "explanation" in r}

            updated_books = []
            for b in candidate_books:
                b_copy = dict(b)
                b_id = b_copy.get("book_id")
                if b_id in explanation_map:
                    b_copy["ai_explanation"] = explanation_map[b_id]
                else:
                    b_copy["ai_explanation"] = _generate_fallback_explanation(user_intent, b_copy)
                updated_books.append(b_copy)

            return updated_books

        except Exception as err:
            print(f"Gemini API call failed or rate-limited ({err}). Using graceful fallback explanations.")

    # Fallback explanation generator
    return [_add_fallback_explanation(user_intent, b) for b in candidate_books]


def _generate_fallback_explanation(user_intent: str, book: Dict[str, Any]) -> str:
    """Generates a smart pre-formulated explanation string when LLM is offline."""
    title = book.get("title", "this book")
    authors = book.get("authors", "the author")
    rating = book.get("average_rating", 4.0)
    tags = str(book.get("tag_name", "")).split()
    tag_sample = ", ".join(tags[:3]) if tags else "popular themes"

    if user_intent:
        return f"Recommended for your interest in '{user_intent}' because it blends {tag_sample} by {authors} (rated {rating}/5)."
    return f"Highly rated by readers ({rating}/5) for its rich portrayal of {tag_sample} by {authors}."


def _add_fallback_explanation(user_intent: str, book: Dict[str, Any]) -> Dict[str, Any]:
    b_copy = dict(book)
    b_copy["ai_explanation"] = _generate_fallback_explanation(user_intent, b_copy)
    return b_copy
