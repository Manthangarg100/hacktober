import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from gemma_service import analyze_case, ModelConfigurationError, ModelRequestError

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(
    title="CIPHER AI — Evidence Intelligence",
    description="A responsible, Gemma-powered case-document analysis prototype.",
    version="0.1.0",
)

app.mount("/static", StaticFiles(directory=PROJECT_DIR / "frontend"), name="static")


class AnalyzeRequest(BaseModel):
    case_text: str = Field(min_length=20, max_length=30000)
    question: str = Field(default="Summarize the material and identify points requiring verification.",
                          min_length=3, max_length=1500)
    mode: Literal["summary", "question", "entities"] = "summary"


@app.get("/")
def home():
    return FileResponse(PROJECT_DIR / "frontend" / "index.html")


@app.get("/api/health")
def health():
    configured = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "ok",
        "service": "CIPHER AI",
        "model_configured": configured,
        "model": os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it"),
    }


@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="Gemma is not configured. Add GEMINI_API_KEY to backend/.env and restart the server.",
        )
    try:
        result = analyze_case(
            case_text=payload.case_text,
            question=payload.question,
            mode=payload.mode,
        )
        return {"model": os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it"), "result": result}
    except ModelConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ModelRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception:
        # Avoid leaking API credentials or provider internals to the browser.
        raise HTTPException(status_code=502, detail="Gemma request failed. Check the server terminal and API configuration.")
