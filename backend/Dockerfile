FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i --force

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
