# -----------------------------------------------------------------------------
# OSIRIS build stage
# OSIRIS contains server API routes (news, geo, CCTV, OSINT, AI, etc.), so it
# cannot be reduced to a static-only bundle without rewriting those features.
# We build its standalone Next.js server here and keep it private at 127.0.0.1.
# CIPHER reverse-proxies it through /osiris on the same public origin.
# -----------------------------------------------------------------------------
FROM node:22-bookworm-slim AS osiris-build
WORKDIR /build/osiris
COPY osiris/package.json osiris/package-lock.json ./
RUN npm ci
COPY osiris/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# CIPHER runtime
# -----------------------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=10000 \
    OSIRIS_INTERNAL_PORT=3001 \
    OSIRIS_INTERNAL_URL=http://127.0.0.1:3001 \
    CIPHER_UPLOADS_DIR=/tmp/cipher-uploads \
    CIPHER_RAG_DIR=/tmp/cipher-rag \
    CIPHER_FRONTEND_DIR=/app/frontend \
    CIPHER_FACE_MODEL_ROOT=/tmp/cipher-models \
    CIPHER_FACE_PROVIDERS=CPUExecutionProvider \
    LLM_PROVIDER=gemini \
    LLM_FALLBACK_ORDER=gemini \
    GEMINI_ENABLED=true \
    OPENROUTER_ENABLED=false \
    OLLAMA_ENABLED=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       tesseract-ocr \
       libgl1 \
       libglib2.0-0 \
       libgomp1 \
       libsm6 \
       libxext6 \
       libxrender1 \
       ca-certificates \
       wget \
    && rm -rf /var/lib/apt/lists/*

# Node is used only for the private OSIRIS standalone server. No public Node
# port is exposed.
COPY --from=osiris-build /usr/local/bin/node /usr/local/bin/node
COPY --from=osiris-build /build/osiris/.next/standalone /app/osiris
COPY --from=osiris-build /build/osiris/.next/static /app/osiris/.next/static
COPY --from=osiris-build /build/osiris/public /app/osiris/public

WORKDIR /app

COPY requirements-production.txt /app/requirements-production.txt
RUN python -m pip install --upgrade pip \
    && python -m pip install -r /app/requirements-production.txt

COPY app.py pyproject.toml sitecustomize.py /app/
COPY frontend /app/frontend
COPY python_backend /app/python_backend
COPY supabase /app/supabase
COPY samples /app/samples
COPY neo4j_schema.cypher /app/neo4j_schema.cypher
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN useradd --create-home --shell /usr/sbin/nologin cipher \
    && mkdir -p /tmp/cipher-uploads /tmp/cipher-rag /tmp/cipher-models \
    && chown -R cipher:cipher /app /tmp/cipher-uploads /tmp/cipher-rag /tmp/cipher-models

USER cipher
EXPOSE 10000

CMD ["/app/docker-entrypoint.sh"]
