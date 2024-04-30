FROM python:3.11.5-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip install --no-cache-dir -r requirements.txt --upgrade

COPY . /usr/src/app/

EXPOSE 8000