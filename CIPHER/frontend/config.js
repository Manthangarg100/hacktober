/* CIPHER deployment configuration.
   For Vercel + Render, set this to the public HTTPS URL of the Render FastAPI service.
   Example:
     window.CIPHER_API_BASE = "https://cipher-api.onrender.com";
   Leave empty only when the frontend and API are same-origin/local. */
window.CIPHER_API_BASE = "";

/* Optional OSIRIS GIS companion service. The GIS loads it lazily only when
   the investigator selects OSIRIS 3D, so normal CIPHER startup stays fast. */
window.CIPHER_OSIRIS_URL = "";
