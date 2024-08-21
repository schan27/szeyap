FROM python:3.11.5-alpine

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY . /usr/src/api/

RUN pip install --editable .

ARG PORT=8000
EXPOSE $PORT

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "szeyapapi.api:app"]