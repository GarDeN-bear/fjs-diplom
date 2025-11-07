FROM node:22-alpine

WORKDIR /backend
 
ARG NODE_ENV=development
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src src/

CMD ["npm", "run", "start:dev"]