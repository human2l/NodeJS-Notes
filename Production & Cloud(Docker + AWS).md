# Docker

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

## Push Image to Docker Hub

`docker login`

`docker push human2l/masa-project`

Now in one other Dockerfile, we can use this image from docker hub:

```dockerfile
FROM human2l/masa-project:latest
```

# AWS

## Create EC2 instances

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 9.53.05 PM.png" alt="Screen Shot 2022-03-08 at 9.53.05 PM" style="zoom:50%;" />

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 9.54.54 PM.png" alt="Screen Shot 2022-03-08 at 9.54.54 PM" style="zoom:50%;" />

Skip step 2-5 for now.

Step 6: Security Group

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.01.43 PM.png" alt="Screen Shot 2022-03-08 at 10.01.43 PM" style="zoom:50%;" />

HTTP or WebSocket at Application Layer is built on top of TCP at Transport Layer

TCP is used for protocols that are connection based, where you need to connect to something before you can communicate with it. Reliable communication.

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.09.15 PM.png" alt="Screen Shot 2022-03-08 at 10.09.15 PM" style="zoom:50%;" />

We use Custom TCP Rule instead of HTTP so that we can set port to 8000 (HTTP only allows 80). We also allow SSH connection

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.12.02 PM.png" alt="Screen Shot 2022-03-08 at 10.12.02 PM" style="zoom:50%;" />

Final Step

Create a key, which can use to get a secure shell (secure terminal into EC2 instance), so that we can install Docker and configure it.

Download Key Pair into a safe place, if lost, we have to recreate a new instance and do all configuration again

**Warning**: DO NOT upload key to github, or hacker will use this key do whatever they want on our server

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.41.23 PM.png" alt="Screen Shot 2022-03-08 at 10.41.23 PM" style="zoom:50%;" />

Edit name of new instance

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.43.07 PM.png" alt="Screen Shot 2022-03-08 at 10.43.07 PM" style="zoom:50%;" />

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.43.51 PM.png" alt="Screen Shot 2022-03-08 at 10.43.51 PM" style="zoom:50%;" />

Wait for Status checks Okay:

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.52.16 PM.png" alt="Screen Shot 2022-03-08 at 10.52.16 PM" style="zoom:50%;" />

Now 3.26.62.104:8000 can be accessed publically

![Screen Shot 2022-03-08 at 10.46.34 PM](Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.46.34 PM.png)

## SSH

Secure Shell

SSH is a comparable secure protocol for communicating between two devices, two shells(terminals)

`ssh user@host` i.e. `ssh human2l@11.11.11.11`

## Connecting to EC2 Instance with SSH

Click "Connect" button

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.54.28 PM.png" alt="Screen Shot 2022-03-08 at 10.54.28 PM" style="zoom:50%;" />

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 10.55.06 PM.png" alt="Screen Shot 2022-03-08 at 10.55.06 PM" style="zoom:50%;" />

Go to the folder that have private key file, change permission of key file to 400:

`chmod 400 masa-project-key-pair.pem`

connect by using the Example command in the image: 

`ssh -i "masa-project-key-pair.pem" ec2-user@ec2-3-26-62-104.ap-southeast-2.compute.amazonaws.com`

or

`ssh -i "masa-project-key-pair.pem" ec2-user@3.26.62.104`

`ec2-user` will be the username we login as.

Below will shown on first time:

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 11.06.13 PM.png" alt="Screen Shot 2022-03-08 at 11.06.13 PM" style="zoom:100%;" />

Then we are in the Amazon Linux Server:

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 11.09.05 PM.png" alt="Screen Shot 2022-03-08 at 11.09.05 PM" style="zoom:100%;" />

## Setting Up EC2 Server

`yum` is a package manager in Amazon linux

`sudo yum update -y`

`sudo yum install docker`

`sudo service docker start` to run docker in the background of our server

Now we can use docker command. i.e. `sudo docker info`

`sudo usermod -a -G docker ec2-user` to add user to docker group.  `-a` : add `-G` : group

Then 

`exit`

and

`ssh -i "masa-project-key-pair.pem" ec2-user@3.26.62.104`

to exit and login again.

Now we don't need to add `sudo` anymore because "ec2-user" now have permission to access docker

## Deploying Project

Other options instead of deploying docker container directory

**Docker Compose**: a tool for setting up docker applications with multiple containers.

**ECS**: the Amazon special build service for deploying Docker containers (cost money and more complicated setup)

Using Docker directly:

1. login to EC2 instance: `ssh -i "masa-project-key-pair.pem" ec2-user@3.26.62.104`

2. check docker works fine: `docker info`

3. log into docker hub: `docker login`

4. docker run with restart policy--always: `docker run --restart=always -p 8000:8000 human2l/masa-project` 

   For m1-chip MAC: (see solution below first)

   `docker run --restart=always --platform linux/amd64 -p 8000:8000 human2l/masa-project`

    so that if our application or container exists or stops, it will be restarted. 

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 11.41.14 PM.png" alt="Screen Shot 2022-03-08 at 11.41.14 PM" style="zoom:50%;" />

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 11.41.55 PM.png" alt="Screen Shot 2022-03-08 at 11.41.55 PM" style="zoom:50%;" />

These docker restart policies take the place of other tools like the "Forever Package" or "PM2" which are often used to restart node process when they crash.

Reference: 
https://docs.docker.com/config/containers/start-containers-automatically/
https://www.joyent.com/node-js/production/design/errors

5. Now we can access the deployed application at `http://3.26.62.104:8000/`

---

Note: for m1 chips MAC, when we run `docker run --restart=always -p 8000:8000 human2l/masa-project`

 it probably show this error:

![Screen Shot 2022-03-08 at 11.54.10 PM](Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-08 at 11.54.10 PM.png)

See this article: https://betterprogramming.pub/how-to-actually-deploy-docker-images-built-on-a-m1-macs-with-apple-silicon-a35e39318e97

In Docker Preferences -> Docker Engine: Set `"experimental": true`

Then run command in the project folder:

```shell
docker buildx create --name m1_builder
docker buildx use m1_builder
docker buildx inspect --bootstrap
docker buildx build --platform linux/amd64 --tag human2l/masa-project --push ./
```

Now in docker hub, OS/ARCH will be linux/arm64

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-09 at 12.22.12 AM.png" alt="Screen Shot 2022-03-09 at 12.22.12 AM" style="zoom:50%;" />

Reference: 

<img src="Production & Cloud(Docker + AWS).assets/Screen Shot 2022-03-09 at 12.21.09 AM.png" alt="Screen Shot 2022-03-09 at 12.21.09 AM" style="zoom:50%;" />

https://alex-shim.medium.com/building-a-docker-image-for-aws-x86-64-ec2-instance-with-mac-m1-chip-44a3353516b9
