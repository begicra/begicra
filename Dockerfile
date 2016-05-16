FROM ubuntu:14.04
ENV APP_HOME /app
ENV NVM_DIR /app/.nvm

RUN apt-get -qq update && apt-get install -qqy curl && rm -rf /var/lib/apt/lists
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
RUN . ${NVM_DIR}/nvm.sh && nvm install stable

WORKDIR ${APP_HOME}
ADD package.json package.json
RUN . ${NVM_DIR}/nvm.sh && npm install --no-progress && rm -rf /root/.npm
ADD index.js index.js
ADD bbs bbs
ADD database database
ADD dashbaord dashbaord
ADD gomi gomi
ADD monitor monitor

EXPOSE 3000/tcp
ENTRYPOINT . ${NVM_DIR}/nvm.sh && npm start
