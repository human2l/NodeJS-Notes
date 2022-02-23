# Node Cluster

## Blocking Functions

Blocking Functions that can block event loop

1. `JSON.stringify()`

2. `JSON.parse()`

3. `[1,6,3,2,4].sort()`

4. `crypto`module of node that are designed to execute slowly so that it takes longer for hacker to guess password

When event loop been blocked, server will not handle any other requests unless current task end

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 12.52.26 PM.png" alt="Screen Shot 2022-02-23 at 12.52.26 PM" style="zoom:50%;" />

Solution: running multiple node processes

## Node Cluster Module

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 8.29.47 PM.png" alt="Screen Shot 2022-02-23 at 8.29.47 PM" style="zoom:50%;" />

Node using Round-Robin approach to allocate requests between workers

That means when we have 3 requests, 1=>worker1, 2=>worker2, 3=>worker1

In windows the allocate approach is handled by windows os, windows might use other different approaches.

```js
const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  // JSON.stringify({}) => "{}"
  // JSON.parse("{}") => {}
  // [5,1,2,3,4].sort()
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js...');
if (cluster.isMaster) {
  console.log('Master has been started...');
  //create workers base on how many processors cpu has. each processor a worker
  const NUM_WORKERS = os.cpus().length;
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  console.log('Worker process started.');
  app.listen(3000);
}
```

Workers will run excatly the same code of server.js, the only difference is the isMaster condition.

Test: open two tabs in browser to access the same url: localhost:3000/timer

Note: Remember to disable browser's cache to test: 

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 8.43.45 PM.png" alt="Screen Shot 2022-02-23 at 8.43.45 PM" style="zoom:25%;" />

Otherwise the browser will wait for the first /timer request, and cache the respond which will be given to the second tab.

Logical cores running slower than physical cores

# Load balancing

## Two strategy used by load balancers:

### Vertical scaling

Add more speed to our one node process. i.e. replacing cpu with a faster one

### Horizontal scaling

Adding more servers or node processers

## Static load distribution without prior knowledge

Strategys when we don't know the execution time of incoming requests:

### Round-Robin

That means when we have 3 requests and 2 workers, req1=>worker1, req2=>worker2, req3=>worker1, req4=>worker2, req5=>worker1

### Randomized static

requests will be distributed randomly to workers

##### Note: These two strategies are look silly but the most effective under this circumstance

# PM2

A process manager uses Node.js cluster module inside

`npm i pm2 -g`

`pm2 start server.js`

`pm2 list` or `pm2 ls` to see mp2 managed server

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 10.10.31 PM.png" alt="Screen Shot 2022-02-23 at 10.10.31 PM" style="zoom:50%;" />

`pm2 stop [id/name]` to stop a server. i.e. `pm2 stop 0` or `pm2 stop server`

`pm2 start [id/name]` to start a server

`pm2 delete [id/name]` to delete a server from pm2 management

```js
const express = require('express');
const app = express();

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js...');
console.log('Worker process started.');
app.listen(3000);
```

`pm2 start server.js -i [number of workers]` i.e. `-i 2`for 2 workers, `-i max`for max workers

It will automatically create clusters for us:

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 11.26.16 PM.png" alt="Screen Shot 2022-02-23 at 11.26.16 PM" style="zoom:50%;" />

`pm2 logs` to show what being logged

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 11.26.33 PM.png" alt="Screen Shot 2022-02-23 at 11.26.33 PM" style="zoom:50%;" />

`pm2 restart server.js`

<img src="Performance optimaztion.assets/Screen Shot 2022-02-23 at 11.28.03 PM.png" alt="Screen Shot 2022-02-23 at 11.28.03 PM" style="zoom:50%;" />

`pm2 logs --lines 200` show recent 200 lines of logs

