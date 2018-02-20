FROM node:carbon
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8080
RUN cat test/samples/hello-frags.txt | node index.js
