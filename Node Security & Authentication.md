# SSL and TLS

TLS: successor to SSL. i.e. SSL1.0 => SSL2.0 => SSL3.0 => TLS1.0....

With TLS, only the domain and server's port number are exposed. All of the data in the body of the request and any specific paths are all encrypted.

## Digital Certificate

To verify the server is not a fake or malicious one.

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-01 at 8.13.16 PM.png" alt="Screen Shot 2022-03-01 at 8.13.16 PM" style="zoom:30%;" />

One of the most famous certificate authority is [Let's Encrypt](https://letsencrypt.org/)

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-01 at 8.16.24 PM.png" alt="Screen Shot 2022-03-01 at 8.16.24 PM" style="zoom:33%;" />

# OpenSSL

OpenSSL is installed defaultly on MAC, on windows, it will be installed with git installation

`openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365`

`req`: request

`-x509` means this is a self-signed certificate

`-newkey`: private key

`rsa:4096`:4096 bits size of key using rsa encryption

`-nodes`: allows us access the "newkey" without a password

`-keyout`: output the key

`.pem` is a common format used for certificates

`key.pem` is private key, `cert.pem` is public used by browser to check the ownership

`-days 365`: This self-signed certificate will be valid in 365 days, if not specified, then 30 days

This command will ask several questions:

Common name: Often use the website domain i.e. www.google.com. Self-signed no need to write domain name

#### server.js

```js
const fs = require('fs');
const https = require('https');
const express = require('express');

const PORT = 3000;

const app = express();

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
```

Note: use built-in file system module function `fs.readFileSync()` to load them first before pass in `createServer()`