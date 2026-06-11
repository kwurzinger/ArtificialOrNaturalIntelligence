FROM node:26-alpine
COPY ["./", "/usr/src/artificialornaturalintelligence/backend"]
EXPOSE 3000
RUN cd /usr/src/artificialornaturalintelligence/backend \
	&& npm install
CMD cd /usr/src/artificialornaturalintelligence/backend \
	&& npm run start
