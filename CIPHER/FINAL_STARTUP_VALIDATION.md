# CIPHER + OSIRIS — FINAL STARTUP VALIDATION

## Root cause fixed

The previous package could start CIPHER on port 8000 while the private OSIRIS process on port 3001 had not started or had already exited. CIPHER then correctly returned HTTP 503 from `/osiris/` because its upstream was unavailable.

The Windows launcher is now fail-safe:

1. prepares Python;
2. prepares/builds OSIRIS;
3. kills stale port 3001 processes;
4. starts OSIRIS with an explicit working directory through `cmd.exe` + `npm.cmd`;
5. writes OSIRIS output to `osiris_start.log`;
6. waits up to 90 seconds for `http://127.0.0.1:3001/api/health`;
7. starts CIPHER only after OSIRIS is confirmed alive;
8. waits for CIPHER `/api/health`;
9. opens CIPHER on port 8000.

If OSIRIS cannot start, CIPHER is not falsely reported as ready and the launcher prints the OSIRIS log.

## Browser/session behavior

OSIRIS remains behind CIPHER's same-origin `/osiris/` reverse proxy. The browser does not navigate to port 3001 and does not open a second login/session.

## Auth noise fix

AI activity and Review badge startup calls now skip protected API requests when no login token exists. This removes the pre-login 401 noise that previously appeared in DevTools during public-page boot. Authenticated protected routes were tested separately and returned 200.

## Tests executed in this environment

- Python compile check: PASS
- Frontend `node --check` for `script.js`: PASS
- Frontend `node --check` for `runtime.js`: PASS
- CIPHER → OSIRIS proxy success path using a local OSIRIS mock: PASS (HTTP 200)
- CIPHER → OSIRIS proxy failure path: PASS (HTTP 503 with explicit OSIRIS-unavailable JSON)
- Register/login smoke test: PASS
- Create case smoke test: PASS
- Duplicate case-number collision handling: PASS (`C-2026-014` → `C-2026-015`)
- Case list contains newly created case: PASS
- GIS endpoint authentication/data contract: PASS
- Authenticated AI activity endpoint: PASS (HTTP 200)
- Authenticated Review endpoint: PASS (HTTP 200)
- Incomplete local OSIRIS `node_modules` and `.next` artifacts removed from the package so the launcher cannot mistake a partial install for a valid build.

## Build limitation

A full `npm ci` / Next.js production build could not be completed in this execution environment because the external npm package download timed out. The final Windows launcher performs the real `npm ci` and `npm run build` locally and refuses to start CIPHER until the OSIRIS process passes its health check.

Docker/Render uses the root Dockerfile and its own OSIRIS build stage; the Windows `.bat` files are not used in deployment.
