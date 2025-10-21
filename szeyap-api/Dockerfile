FROM python:3.11.5-alpine

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Copy project files for dependency resolution
COPY pyproject.toml uv.lock ./

# Copy source code (needed for local package install)
COPY src/ ./src/

# Sync dependencies and install the project
RUN uv sync

# Copy the rest of the application files
COPY . .

ARG PORT=8000
EXPOSE $PORT

# TODO: Download FastText language models

# Use uv to run the application
CMD ["uv", "run", "gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "szeyapapi.api:app"]
