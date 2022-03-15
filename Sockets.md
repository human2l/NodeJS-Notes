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