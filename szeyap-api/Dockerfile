FROM python:3.11.5-alpine

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY . /usr/src/api/

RUN ls
RUN pip install --editable .

CMD ["python", "src/szeyapapi/api.py"]