:: assumes we're just deving cause who would run a server on windows *cough*
cd src
poetry run uvicorn app:app --host localhost --port 8000 --reload --use-colors --log-level info
cd ..
