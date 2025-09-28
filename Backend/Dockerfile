FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry \
 && poetry config virtualenvs.create false \
 && poetry install --only main --no-interaction --no-ansi --no-root
COPY . .
EXPOSE 8000

CMD ["uvicorn", "cmd.main:app", "--host", "0.0.0.0", "--port", "8000"]
