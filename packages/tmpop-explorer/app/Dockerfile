FROM mhart/alpine-node:6.7.0

RUN apk add --no-cache git make gcc g++ python

ADD package.json /src/package.json
RUN cd /src; npm install
ADD . /src/

WORKDIR /src/

ENV NODE_ENV production

RUN npm run build

CMD npm start
