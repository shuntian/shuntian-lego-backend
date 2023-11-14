FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app/
EXPOSE 7001
CMD npx egg-scripts start --title=egg-server-shuntian-lego
