FROM node:6.7.0

RUN mkdir /src

RUN npm install -g mocha@^2.5.3 nodemon@^1.9.2 should@^10.0.0

ONBUILD ADD package.json /src/package.json
ONBUILD RUN cd /src; npm install

ONBUILD WORKDIR /src/server

ONBUILD CMD npm start
