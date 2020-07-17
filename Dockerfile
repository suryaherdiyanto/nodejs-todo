FROM node:14

USER node

WORKDIR /home/node/app

ENV NODE_ENV development

EXPOSE 3000
