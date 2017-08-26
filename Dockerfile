FROM node:7.10-alpine

ADD package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /server && cp -a /tmp/node_modules /server

WORKDIR /server
ADD . /server

EXPOSE 8080
ENTRYPOINT ["npm", "start"]