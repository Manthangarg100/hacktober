# CIPHER Single-Origin OSIRIS — Validation

## Startup model
- `Start_Cipher.bat` is the only local startup command.
- `Stop_Cipher.bat` is the only local stop command.
- No standalone OSIRIS launcher is included.
- No local production compose launcher is included.
- No public OSIRIS browser port is required.

## Architecture
- CIPHER public origin: port 8000 locally / Render public port in production.
- OSIRIS internal Next.js runtime: loopback port 3001.
- Browser entrypoint: `/osiris/` through FastAPI.
- Same-origin browser session; no second login.
- CIPHER remains the data/auth source of truth.

## Checks performed
- Python syntax (`app.py`, `python_backend/*.py`) — PASS
- CIPHER JavaScript syntax — PASS
- FastAPI `/api/health` startup test — PASS
- CIPHER `/` frontend response — PASS
- `/osiris/` reverse-proxy routing with a local OSIRIS upstream — PASS
- OSIRIS asset routing through `/osiris` referer — PASS
- CIPHER API routing remains separate from OSIRIS proxy routing — PASS
- Dockerfile contains internal OSIRIS build/runtime and only exposes CIPHER port — PASS
- ZIP integrity — PASS

## Environment limitation
A full `npm ci` / `npm run build` for OSIRIS could not be completed in this execution environment because the external npm download timed out. The package therefore does not claim a successful Next.js production build here. `Start_Cipher.bat` performs the dependency installation and production build on the first local run and stops with a clear error if either fails.
