FROM node:carbon
WORKDIR /app
COPY . /app
RUN npm install
