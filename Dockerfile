FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm ci
EXPOSE 7001
CMD npx egg-scripts start --title=egg-server-shuntian-lego
