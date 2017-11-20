FROM node:8

RUN npm install -g yarn

RUN mkdir /agent-ui
ADD package.json /agent-ui/package.json
ADD yarn.lock /agent-ui/yarn.lock
RUN cd /agent-ui; yarn install
ADD . /agent-ui/
WORKDIR /agent-ui

ENV NODE_ENV production
RUN yarn build

RUN npm install -g serve
CMD serve -s build -p 4000