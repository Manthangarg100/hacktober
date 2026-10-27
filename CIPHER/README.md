# CIPHER — Gemma 4 Evidence Intelligence Workspace

CIPHER is an investigator-support prototype for organizing case evidence, reviewing possible entity connections, and drafting evidence-aware investigation summaries. It is designed as decision support: model-generated suggestions are leads for human review, not verified facts or determinations of guilt.

## What is included

- FastAPI backend and browser frontend.
- Case-level AI query and evidence-processing workflows.
- Google AI Studio / Gemma model integration, with provider status and existing fallback configuration.
- Optional Neo4j graph projection and OSIRIS visualization components.
- Offline provider QA test and a live Gemma API connectivity test.

## Requirements

- Windows 10/11 recommended for the provided `.bat` launcher.
- Python 3.12 recommended (the launcher attempts Python 3.12 first).
- Node.js 20 or newer for the integrated OSIRIS frontend.
- Internet access for dependency installation and hosted model calls.

## Quick start on Windows

1. Extract this ZIP to a writable folder.
2. Copy `.env.example` to `.env` in the project root if `.env` does not already exist.
3. Open `.env` and set `GEMINI_API_KEY` to a newly created Google AI Studio key. Keep this file private.
4. Leave `GEMINI_MODEL=gemma-4-26b-a4b-it` unless you have confirmed another supported Gemma model ID for your API account.
5. Double-click `Start_Cipher.bat`. The first run can take several minutes while dependencies are installed and the OSIRIS frontend is built.
6. Open `http://127.0.0.1:8000/`. API documentation is at `http://127.0.0.1:8000/docs`.

The launcher requires Node.js for the integrated OSIRIS frontend. If you only need to inspect the backend, use the instructions in `python_backend/README.md` and check the actual import/startup requirements before launching it separately.

## Verify Gemma before demo day

Run from the project root in a terminal where the project's Python dependencies are installed:

```powershell
python tools/test_gemma_api.py
```

A `PASS` means the configured model returned a live response. A `401`/`403` generally indicates a key or API access problem; `404` indicates the model ID may not be available; `429` indicates a quota or rate-limit issue. The script does not print the API key.

To test the application's provider routing without using a live API key:

```powershell
$env:PYTHONPATH = "."
python python_backend/llm_provider_qa.py
```

This test runs against a local mock HTTP server and checks Gemini primary, OpenRouter fallback, Ollama fallback, and all-providers-unavailable behavior. It does **not** prove that the live Google API is reachable.

## Useful endpoints

- `GET /health` — application health details.
- `GET /api/health/ai` — AI provider configuration/status.
- `GET /docs` — interactive API documentation.
- Case-level AI endpoints require the authentication flow used by the app.

## Demo workflow

1. Start CIPHER and sign in or register using the application's supported flow.
2. Use synthetic/demo case data or approved non-sensitive evidence.
3. Run the evidence or case-level AI workflow.
4. Check the response's provider/model metadata. For a Gemma demonstration, confirm that the actual response reports `gemini` and the configured Gemma model.
5. Review the evidence references, uncertainty notes, and candidate relationships. Human review is required before a candidate is treated as verified.

## Security and responsible use

- Never commit `.env`, API keys, passwords, or private case data. `.env` is excluded by `.gitignore`.
- A key pasted into a chat, issue, log, or public repository should be revoked and replaced.
- Do not send confidential investigative records to a hosted model unless the data owner has explicitly authorized it.
- AI-generated entities and links may be wrong. Do not treat a model output, face-match candidate, or ML prediction as proof.
- Require investigator review before official report approval or case actions.

## Test status and known limits

The package's Python source has been syntax-compiled, and the offline provider-routing QA test passed in the build environment. These checks are not a substitute for running the live Gemma test and full Windows launcher/browser workflow on the machine used for the presentation. Database credentials, Neo4j connectivity, OSIRIS dependency installation, model quota, and all end-to-end UI paths depend on the local setup and have not been certified by these offline checks.

See `GEMMA4_HACKDAY_SUBMISSION.md` for the architecture, demo flow, and submission checklist, and `GEMMA4_TEST_REPORT.txt` for the recorded packaging checks.
