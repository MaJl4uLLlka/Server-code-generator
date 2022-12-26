FROM node:18-alpine

WORKDIR /app

COPY ./src/env/.env .env
COPY ./src/backend/package.json package.json
COPY ./src/backend/package-lock.json package-lock.json
RUN apk add --update --no-cache openssl1.1-compat

EXPOSE 3000

CMD npm install &&\
    npm run start:prod