FROM node:16

WORKDIR /app

COPY .src/env/local.env .env

EXPOSE 3000

CMD npm install &&\
    npm run start