FROM node:4.3.1
MAINTAINER Romain Silvestri <romain.silvestri@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/auditor.js"]