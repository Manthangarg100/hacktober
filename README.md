# CIPHER AI — Evidence Intelligence Assistant

A new, Gemma-powered prototype for responsible case-document understanding. This repository is a focused AI-first application, not a copy of the original CIPHER dashboard.

## What works
- FastAPI backend with a health endpoint.
- Gemma 4 analysis through the Google Gen AI SDK.
- Case text input and question answering in a responsive interface.
- Demo case preloaded for quick evaluation.
- Safety framing: model outputs are leads for human review, not findings of guilt.

## Requirements
- Python 3.10+
- A Google AI Studio API key with access to the selected Gemma model.

## Run locally (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit backend\.env and set GEMINI_API_KEY
python -m uvicorn main:app --reload --port 8000
```
Open `http://127.0.0.1:8000` to use the UI and `http://127.0.0.1:8000/docs` for API docs.

## Model configuration
The default is `gemma-4-26b-a4b-it`. You can change `GEMMA_MODEL` in `backend/.env` to another model identifier supported for your API access. See the [official Gemma API docs](https://gemma.ai/deployment/gemini-api/).

## Important
- Never commit `.env` or expose API keys in browser code.
- Use synthetic/demo data only unless you have explicit authorization to process real case records.
- Model outputs can be incorrect. Review all claims against the original material before relying on them.
- The interface currently accepts pasted case text. PDF parsing, persistent case storage, graph integration, authentication, and deployment are follow-up tasks, not yet implemented.
