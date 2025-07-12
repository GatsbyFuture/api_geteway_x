FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY dist ./dist

COPY .env .env

EXPOSE 5150

CMD ["node", "dist/app.js"]
