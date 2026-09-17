FROM python:3.13-slim-bookworm

ENV POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install --no-install-recommends -y gcc git libc6-dev libgl1 libglib2.0-0 nim \
    && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --no-cache-dir poetry

WORKDIR /backend
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main --no-root
RUN python -c "from toascii import ConverterOptions, HtmlColorConverterNim; HtmlColorConverterNim(ConverterOptions(gradient=' .'))"

COPY . .
RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /backend
USER appuser

WORKDIR /backend/src
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--timeout-keep-alive", "5"]
