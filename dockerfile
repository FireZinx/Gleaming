FROM node:22-alpine AS build

WORKDIR /usr/local/app

COPY ./package.json /usr/local/app/package.json

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/out /usr/share/nginx/html