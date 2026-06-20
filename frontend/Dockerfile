FROM node:26-alpine as build
COPY ["./", "/usr/src/artificialornaturalintelligence/frontend"]
EXPOSE 4200
RUN cd /usr/src/artificialornaturalintelligence/frontend \
    && npm ci \
    && npm run build

FROM nginx:mainline
RUN sed -i 's/listen\(.*\)80;/listen\14200;/' /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/artificialornaturalintelligence/frontend/dist/prod /usr/share/nginx/html
