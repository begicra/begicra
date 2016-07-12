FROM node:6
ENV APP_HOME /app

WORKDIR ${APP_HOME}
ADD package.json package.json
RUN npm install --no-progress && rm -rf /root/.npm
ADD index.js index.js
ADD libs libs
ADD bbs bbs
ADD database database
ADD dashbaord dashbaord
ADD gomi gomi
ADD monitor monitor

EXPOSE 3000/tcp
ENTRYPOINT npm start
