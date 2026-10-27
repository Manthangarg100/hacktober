# CIPHER — Gemma 4 Evidence Intelligence Workspace

## What this project does

CIPHER is an investigator-support prototype for organizing case evidence, exploring entity relationships, and drafting evidence-aware investigation summaries. It is decision support: it does not determine guilt, replace investigators, or treat model-generated suggestions as verified facts.

## Gemma 4 integration

The Python backend contains a Google AI Studio / Gemini API integration. The default model ID is `gemma-4-26b-a4b-it`, documented by Google's Gemma API guide. The API key must be supplied locally through `GEMINI_API_KEY`; it must never be committed to source control or placed in browser JavaScript.

The application may support additional providers and fallback behavior depending on environment settings. For a Gemma-focused demonstration, set `LLM_PROVIDER=gemini`, configure a valid `GEMINI_API_KEY`, and keep fallback behavior disabled or limited as supported by the existing provider implementation. Verify the provider reported by the application's response before claiming the request was served by Gemma.

Official model documentation: https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api
API key management: https://aistudio.google.com/apikey

## Windows setup

Requirements: Python 3.12 recommended for the provided launcher, Node.js 20 or newer for the integrated OSIRIS frontend, and internet access for installing dependencies and hosted model calls.

1. Extract the project ZIP to a writable folder.
2. Open that folder in VS Code.
3. Copy `.env.example` to `.env` if `.env` does not already exist.
4. Add a newly created API key to `GEMINI_API_KEY` in `.env`. Do not commit `.env`.
5. Double-click `Start_Cipher.bat` and wait for the readiness message.
6. Open `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/docs`.

The first startup may take several minutes because Python and Node dependencies may be installed and the OSIRIS frontend may be built.

## Verify the actual Gemma API call

From the project root with the virtual environment active, run:

```powershell
python tools/test_gemma_api.py
```

A `PASS` means the script received a live response from the configured model. A failure should be resolved before the project is demonstrated as Gemma-powered. The test does not print the API key.

## Offline provider regression test

Run from the project root:

```powershell
$env:PYTHONPATH = "."
python python_backend/llm_provider_qa.py
```

This uses a local mock HTTP server and verifies provider selection and fallback logic; it does not call Google's live API.

## Health and application checks

- `GET /health` — application health (details depend on configuration).
- `GET /api/health/ai` — AI provider configuration/status.
- `GET /docs` — API documentation.
- Login and case-level AI routes require a valid application session/token as implemented by the backend.

## Demo flow

1. Start CIPHER and sign in using a demo account that is configured in the local database, or register through the application's supported flow.
2. Open an existing synthetic/demo case or create one using non-sensitive sample evidence.
3. Ask a case-level AI question or use the available evidence processing workflow.
4. Confirm the response/provider metadata indicates `gemini` when demonstrating Gemma.
5. Review evidence/source references and uncertainty statements. Treat extracted entities and relationships as candidate leads until a human investigator verifies them.

Do not use confidential case records in an external hosted model unless the data owner has explicitly authorized that processing.

## Testing status and limitations

The ZIP's Python source was syntax-compiled and the existing offline provider QA script passed in the build environment. These checks do not prove that the live Google API key, model quota, full Windows startup, database configuration, Neo4j Aura connection, or all browser workflows work on another computer. Run the live API test and launch checklist on the demo machine before presenting. No live API key is included in this repository.

## Security checklist

- Keep `.env` private and out of Git.
- Use synthetic or approved data in hosted AI requests.
- Do not treat model output as a verified allegation or proof.
- Keep investigator review in the loop before creating or approving official reports.
- Replace any API key that was pasted into a chat, issue, source file, or public repository.
