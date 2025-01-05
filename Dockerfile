FROM node:20-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . /usr/app

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
