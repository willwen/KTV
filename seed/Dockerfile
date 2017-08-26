FROM mongo:latest

RUN mkdir -p /server
ADD scripts/ /server
WORKDIR /server

CMD mongoimport --db songs --host mongodb --collection songs --file songs.json