FROM node:22-alpine

WORKDIR /frontend
 
ARG NODE_ENV=development
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src src/

CMD ["npm", "run", "dev"]