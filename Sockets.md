# Polling

<img src="Sockets.assets/Screen Shot 2022-03-15 at 12.19.31 PM.png" alt="Screen Shot 2022-03-15 at 12.19.31 PM" style="zoom:50%;" />

```js
const POLL_RATE = 500;

setInterval(async () => {
	message = await fetch('https://api.mychatapp.com/messages')
}, POLL_RATE)
```

# Sockets

<img src="Sockets.assets/Screen Shot 2022-03-15 at 11.58.53 AM.png" alt="Screen Shot 2022-03-15 at 11.58.53 AM" style="zoom:50%;" />

IP Sockets: Internet Protocol Sockets. Building blocks of the internet

Datagram Sockets: UDP Sockets.Used where low latency is the most important factor

TCP Sockets: connection based, we need to connect to one of these sockets before send data through them. Reliable

HTTP: built on TCP Sockets

WebSockets: A JavaScript feature that allows two way communication between a user's browser and a server

# Sockets vs Polling

<img src="Sockets.assets/Screen Shot 2022-03-15 at 12.08.43 PM.png" alt="Screen Shot 2022-03-15 at 12.08.43 PM" style="zoom:50%;" />

Both client and server can decide when to send the message. It's bidirectional.

Server will no longer need to wait for the client's request before sending response

# WebSockets

Popular WebSocket library:

1. ws: for Node.js server-side websocket. It doesn't work on client side. Client side have to use the default JS `WebSocket` module
2. socket.io (recommended) works both front and back end. If the browser doesn't support websockets, it will use polling way to keep working

<img src="Sockets.assets/Screen Shot 2022-03-15 at 12.52.17 PM.png" alt="Screen Shot 2022-03-15 at 12.52.17 PM" style="zoom:50%;" />

Server can notify multiple clients with the newly updated messages

# Multiplayer Pong Game

<img src="Sockets.assets/Screen Shot 2022-03-15 at 3.32.40 PM.png" alt="Screen Shot 2022-03-15 at 3.32.40 PM" style="zoom:50%;" />

Let one of the player as referee which handles the calculation of most of the game data, this makes the server a thin server, which is lightweight and allow us to potentially expand our game with more complicated logic.

## Connecting to socket.io

`npm i --save socket.io`

<img src="Sockets.assets/Screen Shot 2022-03-15 at 3.47.01 PM.png" alt="Screen Shot 2022-03-15 at 3.47.01 PM" style="zoom:50%;" />

#### server.js

```js
const server = require("http").createServer();
//allow CORS
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

server.listen(PORT);
console.log(`Listening on port ${PORT}...`);

io.on("connection", (socket) => {
  console.log("a user connected");
});
```

**CORS**: Read more about socket.io and CORS at https://socket.io/docs/v4/handling-cors/

<img src="Sockets.assets/Screen Shot 2022-03-15 at 3.46.23 PM.png" alt="Screen Shot 2022-03-15 at 3.46.23 PM" style="zoom:30%;" />

Add one of these CDN link to index.html

#### index.html

```html
<body>
    <!-- Script -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js" integrity="sha512-MgkNs0gNdrnOM7k+0L+wgiRc5aLgl74sJQKbIWegVIMvVGPc1+gc1L2oK9Wf/D9pq58eqIJAxOonYPVE5UwUFA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="javascripts/script.js"></script>
</body>
```

After start the server, open index.html in browser, socket.io will swich the protocol to websocket for us

<img src="Sockets.assets/Screen Shot 2022-03-15 at 3.58.58 PM.png" alt="Screen Shot 2022-03-15 at 3.58.58 PM" style="zoom:50%;" />

## Identifying connected clients

Base on socket.io, each socket connection has an ID. We use socket id as player id

#### server.js

```js
//------------------------
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});
```

#### script.js

```js
//------------------------
socket.on("connect", () => {
  console.log("Connected as...", socket.id);
});
```

<img src="Sockets.assets/Screen Shot 2022-03-15 at 4.19.17 PM.png" alt="Screen Shot 2022-03-15 at 4.19.17 PM" style="zoom:50%;" />

<img src="Sockets.assets/Screen Shot 2022-03-15 at 4.19.35 PM.png" alt="Screen Shot 2022-03-15 at 4.19.35 PM" style="zoom:50%;" />

Note:` socket.id` will change every time when reconnected after disconnection

## Broadcast Events

`socket.broadcast.emit`: to all clients except the sender

`io.emit`: to all clients

details see Resources section below

#### server.js

```js
//--------------------folded
let readyPlayerCount = 0;

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("ready", () => {
    console.log("Player ready", socket.id);
    readyPlayerCount++;
    if (readyPlayerCount === 2) {
      io.emit("startGame", socket.id);
    }
  });
});
```

#### script.js

```js
let isReferee = false;
//-----------folded
// Start Game, Reset Everything
function loadGame() {
  createCanvas();
  renderIntro();
  socket.emit("ready");
}

loadGame();

//-----folded

socket.on("connect", () => {
  console.log("Connected as...", socket.id);
});

socket.on("startGame", (refereeId) => {
  console.log("Referee is", refereeId);
  isReferee = socket.id === refereeId;
  startGame();
});
```

<img src="Sockets.assets/Screen Shot 2022-03-15 at 4.37.51 PM.png" alt="Screen Shot 2022-03-15 at 4.37.51 PM" style="zoom:50%;" />

<img src="Sockets.assets/Screen Shot 2022-03-15 at 4.38.03 PM.png" alt="Screen Shot 2022-03-15 at 4.38.03 PM" style="zoom:50%;" />

## Paddle Logic

#### script.js

```js
function startGame() {
  //allocate the two paddle position (top/bottom) to user
  paddleIndex = isReferee ? 0 : 1;
  window.requestAnimationFrame(animate);
  canvas.addEventListener("mousemove", (e) => {
    playerMoved = true;
    paddleX[paddleIndex] = e.offsetX;
    if (paddleX[paddleIndex] < 0) {
      paddleX[paddleIndex] = 0;
    }
    if (paddleX[paddleIndex] > width - paddleWidth) {
      paddleX[paddleIndex] = width - paddleWidth;
    }
    //when paddle move, notify server to broadcast it to opponent's client
    socket.emit('paddleMove', {
      xPosition: paddleX[paddleIndex]
    })
    // Hide Cursor
    canvas.style.cursor = "none";
  });
}

//when received opponent's new paddle position by server, update the opponent's paddle position
socket.on('paddleMove', (paddleData) => {
  // Toggle 1 into 0, 0 into 1
  const opponentPaddleIndex = 1 - paddleIndex;
  paddleX[opponentPaddleIndex] = paddleData.xPosition
})
```

#### server.js

```js
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("ready", () => {
    console.log("Player ready", socket.id);
    readyPlayerCount++;
    if (readyPlayerCount === 2) {
      io.emit("startGame", socket.id);
    }
  });
  socket.on('paddleMove', (paddleData) => {
      socket.broadcast.imit('paddleMove', paddleData)
  })
});
```

## Ball Logic

#### script.js

```js
// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = 3;
  socket.emit('ballMove', {
    ballX,
    ballY,
    score,
  })
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ballY += speedY * ballDirection;
  // Horizontal Speed
  if (playerMoved) {
    ballX += speedX;
  }
  socket.emit('ballMove', {
    ballX,
    ballY,
    score
  })
}

// Called Every Frame
function animate() {
  //allows only referee do the calculation
  if (isReferee){
    ballMove();
    ballBoundaries();
  }
  renderCanvas();
  window.requestAnimationFrame(animate);
}

socket.on('ballMove', (ballData) => {
  ({ ballX, ballY, score } = ballData)
})
```

#### server.js

```js
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("ready", () => {
    console.log("Player ready", socket.id);
    readyPlayerCount++;
    if (readyPlayerCount === 2) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("paddleMove", (paddleData) => {
    socket.broadcast.emit("paddleMove", paddleData);
  });

  socket.on('ballMove', (ballData) => {
      socket.broadcast.emit('ballMove', ballData)
  })
});
```

## Handle diconnect

#### server.js

```js
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("ready", () => {
    console.log("Player ready", socket.id);
    readyPlayerCount++;
    if (readyPlayerCount % 2 === 0) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("paddleMove", (paddleData) => {
    socket.broadcast.emit("paddleMove", paddleData);
  });

  socket.on("ballMove", (ballData) => {
    socket.broadcast.emit("ballMove", ballData);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected: ${reason}`);
  });
});
```

## Using Socket.io with Express

<img src="Sockets.assets/Screen Shot 2022-03-15 at 8.07.05 PM.png" alt="Screen Shot 2022-03-15 at 8.07.05 PM" style="zoom:50%;" />

move "io" logic in `sockets.js`

#### sockets.js

```js
let readyPlayerCount = 0;

const listen = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("ready", () => {
      console.log("Player ready", socket.id);
      readyPlayerCount++;
      if (readyPlayerCount % 2 === 0) {
        io.emit("startGame", socket.id);
      }
    });

    socket.on("paddleMove", (paddleData) => {
      socket.broadcast.emit("paddleMove", paddleData);
    });

    socket.on("ballMove", (ballData) => {
      socket.broadcast.emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });
};

module.exports = {
  listen,
};
```

remove url in script.js: `const socket = io('http://localhost:3000')` to `const socket = io()`

#### api.js

```js
const express = require("express");
const path = require("path");

const api = express();

api.use(express.static(path.join(__dirname, "public")));

api.use("/", express.static("index.html"));

module.exports = api;
```

#### server.js

```js
const apiServer = require("./api");
const http = require("http");
const io = require("socket.io");

const httpServer = http.createServer(apiServer);
const socketServer = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const sockets = require("./sockets");

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

sockets.listen(socketServer);
```













# Resources

## [Emit Cheatsheet](https://socket.io/docs/v4/emit-cheatsheet/)

#### Server-side

```js
io.on("connection", (socket) => {

  // basic emit
  socket.emit(/* ... */);

  // to all clients in the current namespace except the sender
  socket.broadcast.emit(/* ... */);

  // to all clients in room1 except the sender
  socket.to("room1").emit(/* ... */);

  // to all clients in room1 and/or room2 except the sender
  socket.to(["room1", "room2"]).emit(/* ... */);

  // to all clients in room1
  io.in("room1").emit(/* ... */);

  // to all clients in room1 and/or room2 except those in room3
  io.to(["room1", "room2"]).except("room3").emit(/* ... */);

  // to all clients in namespace "myNamespace"
  io.of("myNamespace").emit(/* ... */);

  // to all clients in room1 in namespace "myNamespace"
  io.of("myNamespace").to("room1").emit(/* ... */);

  // to individual socketid (private message)
  io.to(socketId).emit(/* ... */);

  // to all clients on this node (when using multiple nodes)
  io.local.emit(/* ... */);

  // to all connected clients
  io.emit(/* ... */);

  // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
  // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.

  // with acknowledgement
  socket.emit("question", (answer) => {
    // ...
  });

  // without compression
  socket.compress(false).emit(/* ... */);

  // a message that might be dropped if the low-level transport is not writable
  socket.volatile.emit(/* ... */);

  // with timeout
  socket.timeout(5000).emit("my-event", (err) => {
    if (err) {
      // the other side did not acknowledge the event in the given delay
    }
  });
});
```

#### Client-side

```js
// basic emit
socket.emit(/* ... */);

// with acknowledgement
socket.emit("question", (answer) => {
  // ...
});

// without compression
socket.compress(false).emit(/* ... */);

// a message that might be dropped if the low-level transport is not writable
socket.volatile.emit(/* ... */);

// with timeout
socket.timeout(5000).emit("my-event", (err) => {
  if (err) {
    // the other side did not acknowledge the event in the given delay
  }
});
```