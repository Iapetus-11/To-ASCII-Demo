FROM python:3.8

# install stuff for opencv and the nim compiler
RUN apt-get update && apt-get install libglu1-mesa libxi-dev libxmu-dev libglu1-mesa-dev nim -y

# install gunicorn
RUN python -m pip install gunicorn

# setup poetry
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_NO_INTERACTION=1
RUN python -m pip install poetry

# install dependencies
ADD pyproject.toml .
ADD poetry.lock .
RUN poetry install

# copy over rest of files
WORKDIR /backend
ADD . /backend

# run FastAPI app with gunicorn
WORKDIR /backend/src
CMD ["gunicorn", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "app:app", "--workers", "1"]
