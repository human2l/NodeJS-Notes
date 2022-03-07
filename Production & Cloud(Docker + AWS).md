## Serverless vs Containers

Serverless limitation: code might suffer from higher latency, higher response times, cost migration from one cloud platform to another. No physical premises

Docker provides some really well-made tools. And it allows us to build containers that can be used to bundle and share our applications so they can run anywhere on any computer and any server.

## Containers and Virtual Machine

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-07 at 5.57.24 PM.png" alt="Screen Shot 2022-03-07 at 5.57.24 PM" style="zoom:50%;" />

Containers and Virtual Machines Together: Deploy docker on EC2

## Container

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-07 at 6.06.09 PM.png" alt="Screen Shot 2022-03-07 at 6.06.09 PM" style="zoom:50%;" />

## Images

Snapshots of all the files and applications that we need for container. Images are immutable (cannot be updated, can only be created a new one)

## Run docker container

`docker run -p 80:80 docker/getting-started` 

create a container based on image `getting-started`

`-p` for publish, which will map a port from the container to the computer (port forwarding)

`80:80` "port on container":"port on computer"

Now `localhost:80` will be hosting a page like below:

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-07 at 6.32.17 PM.png" alt="Screen Shot 2022-03-07 at 6.32.17 PM" style="zoom:50%;" />

## Docker login

`docker login` to publish our own images to docker hub for free.

## Dockerfile

```dockerfile
FROM node:lts-alpine

WORKDIR /app
# copy all file from project folder to /app folder
COPY . .

RUN npm install --only=production

RUN npm run build --prefix client
# setup a user named "node", or it will be run as root user(might cause security issue)
USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000
```

#### .dockerignore

```
.git

*/node_modules

server/public
```

Above prevents folder inside been copyed by `COPY` command in Dockerfile.

`npm install` might apply different install process on different OS. We need to ignore `/node_modules` folder so that `npm install` will not ignore install process because of it already exists

## Dockerfile Layers

Each time docker building images, as long as the file in each layer doesn't change, docker will not copy these files. 

Docker uses cache to save time.

#### Dockerfile (improved)

```
FROM node:lts-alpine

WORKDIR /app
# use ./ to prevent docker treat /app as a file(if we use . only)
COPY package*.json ./

COPY client/package*.json client/
# Below will only run when package.json or client/package.json changed
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000
```

Note: use package*.json to copy both `package.json` and `package-lock.json` files

Note: Sometimes use the same`package-lock.json` on different OS will cause issues, we can try exclude `package-lock.json`

## Build Docker Image

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-07 at 8.44.24 PM.png" alt="Screen Shot 2022-03-07 at 8.44.24 PM" style="zoom:50%;" />

`docker build . -t human2l/masa-project`

`-t` tag the docker image with `human2l/masa-project`, it can be anything, but base on the convention, use "userID/projectName"

## Run Project in Container

`docker run -it -p 8000:8000 human2l/masa-project`

`-p 8000:8000` portrait mapping port 8000 from container to port 8000 in computer

`-it` gives us a terminal into Docker container. It lets us type into terminal here like in the OS

