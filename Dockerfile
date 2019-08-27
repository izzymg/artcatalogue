FROM node:10

RUN mkdir -p /data
WORKDIR /data

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "start" ]