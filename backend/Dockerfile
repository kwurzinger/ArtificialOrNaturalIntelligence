FROM node:26-alpine
COPY ["./", "/usr/src/aoni/backend"]
EXPOSE 3000
RUN cd /usr/src/aoni/backend \
	&& npm install
CMD cd /usr/src/aoni/backend \
	&& npm run start
