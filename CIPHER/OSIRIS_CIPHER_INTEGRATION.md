# CIPHER + OSIRIS

OSIRIS is integrated into CIPHER as an internal Next.js/MapLibre runtime. It is **not a second public application**.

## Local

- CIPHER public URL: `http://127.0.0.1:8000/`
- OSIRIS internal runtime: `127.0.0.1:3001` only
- Browser OSIRIS URL: `http://127.0.0.1:8000/osiris/`

The browser reaches OSIRIS through the FastAPI reverse proxy. The authentication/session therefore remains on the CIPHER origin.

## Production

The Docker image builds OSIRIS in a Node build stage, copies the standalone runtime into the CIPHER image, starts it on loopback, and exposes only CIPHER's public port.

CIPHER remains the source of truth for cases, evidence, verified entities, GIS data, network data, authentication, and permissions.

The existing Leaflet GIS remains available. OSIRIS is an additional 3D/WebGL visualization mode.
