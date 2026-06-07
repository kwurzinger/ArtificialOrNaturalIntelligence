FROM node:26-alpine
COPY ["./", "/usr/src/aoni/frontend"]
EXPOSE 4200
RUN cd /usr/src/aoni/frontend \
	&& npm install
CMD cd /usr/src/aoni/frontend \
	&& npm run start
