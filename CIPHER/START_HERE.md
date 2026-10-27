# CIPHER — START HERE

## Windows local start

There is **one** startup file:

**`Start_Cipher.bat`**

Double-click it. Do not start OSIRIS separately and do not open port `3001` in the browser.

The launcher will:
1. prepare the Python environment;
2. install CIPHER Python packages if needed;
3. install OSIRIS Node packages if needed;
4. build OSIRIS if needed;
5. start OSIRIS privately on `127.0.0.1:3001`;
6. wait until OSIRIS `/api/health` returns HTTP 200;
7. start CIPHER FastAPI on `127.0.0.1:8000`;
8. wait for CIPHER `/api/health`;
9. open CIPHER in your browser.

After that:

**Login → GIS → OSIRIS 3D**

OSIRIS is reverse-proxied through CIPHER at `/osiris/`, so the browser stays on the same CIPHER origin and the login/session is not replaced.

## If startup fails

The launcher writes the internal OSIRIS output to:

`osiris_start.log`

It will also print the last OSIRIS log lines before exiting. This is specifically to prevent the previous situation where CIPHER was running while OSIRIS was dead and `/osiris/` returned HTTP 503.

## Stop

Use the only stop file:

**`Stop_Cipher.bat`**

Do not manually kill random Node processes unless troubleshooting.

## Render / Docker

Do not use the Windows `.bat` files on Render. Render uses the root `Dockerfile` and `render.yaml`. The Docker entrypoint starts OSIRIS internally and exposes only CIPHER's public port.
