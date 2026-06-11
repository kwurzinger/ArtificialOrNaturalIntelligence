FROM node:26-alpine
COPY ["./", "/usr/src/artificialornaturalintelligence/frontend"]
EXPOSE 4200
RUN cd /usr/src/artificialornaturalintelligence/frontend \
	&& npm install
CMD cd /usr/src/artificialornaturalintelligence/frontend \
	&& npm run start
