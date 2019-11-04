# Art Catalogue - Otago Polytechnic

Web form for Otago Polytechnic art catalogue generation.

Written in VueJS and NodeJS with MariaDB. 🐳

# Docker

1. Create and fill `./.env`


```HOST=0.0.0.0
PORT=3000
CORS_ORIGIN=http://localhost:8080
DB_URL=mysql://usr:pw@maria:3306/artcat
SEED_ON_STARTUP=1
NODE_ENV=production

MYSQL_USER=usr
MYSQL_PASSWORD=pw
MYSQL_ROOT_PASSWORD=rootpw
MYSQL_DATABASE=artcat
```


2. `docker-compose up --build`

3. Build client, and deploy server behind a reverse proxy.

# Prerequisites

* NodeJS v10+, npm

# Client

1. `npm i`
2. `cp example.env .env` and edit it
3. `npm run build`
4. Serve dist/

# Server

1. Spin up a MySQL/MariaDB instance
2. `create database artsite default charset utf8mb4;`
3. Edit `config.js`
4. `npm i`
5. `npm start`
