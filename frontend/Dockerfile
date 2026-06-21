FROM node:26-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:mainline-alpine

EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/prod /usr/share/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]