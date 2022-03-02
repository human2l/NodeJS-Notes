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

# Helmet

https://helmetjs.github.io/

Helmet helps you secure your Express apps by setting various HTTP headers.

`npm install helmet`

```js
app.use(helmet());
//equals to:
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
```

#### server.js

```js
const helmet = require('helmet');
app.use(helmet())
//all other middleware here
```

Note: add to the very top of middleware chain

# Auth: Authentication & Authorization

Authentication validates that users are who they claim to be.

Authorization checks whether user have permission to access aspecific resource once they authenticated.

HTTP response status code:

401 Unauthorized: Actually used when user is **unauthenticated**

403 Forbidden: used when user is **unauthorized**

Authentication = login

Authorization = permission

# Social Sign In

i.e. Sign up in other websites using google account.

# API Key

Two purposes:

1. It is an unique identifier for your project, so that server will know which application the request came from. Some of API keys for this purpose often public.

   i.e. identify how frequently API requests send by a user, if too often,  `429 Too Many Requests`

2. To grand and restrict access to some API

# JWT

Json Web Tokens https://jwt.io/

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-01 at 10.15.49 PM.png" alt="Screen Shot 2022-03-01 at 10.15.49 PM" style="zoom:50%;" />

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-01 at 10.25.24 PM.png" alt="Screen Shot 2022-03-01 at 10.25.24 PM" style="zoom:50%;" />

#### Header

#### Payload

sub: subject identifier. It tells who this token carry information about, usually a unique userID or hash. So that each claim in the payload is made about the subject.

iat: issued at. It is the time and date the JWT was created, can be used i.e. how old this token is.

#### Verify Signature

# OAuth

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-01 at 10.33.34 PM.png" alt="Screen Shot 2022-03-01 at 10.33.34 PM" style="zoom:50%;" />

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 8.44.42 AM.png" alt="Screen Shot 2022-03-02 at 8.44.42 AM" style="zoom:50%;" />

## Register with the google authorization server

To enable google as authorization server:

1. go to https://console.cloud.google.com
2. Select or create new application. i.e. Node Application
3. Go to sidebar -> APIs and services -> Credentials

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.10.15 AM.png" alt="Screen Shot 2022-03-02 at 9.10.15 AM" style="zoom:50%;" />

4. Create Credentials -> OAuth client ID

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.13.07 AM.png" alt="Screen Shot 2022-03-02 at 9.13.07 AM" style="zoom:50%;" />

5. Configure consent screen -> External (or Internal only with users inside google workplace)

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.15.13 AM.png" alt="Screen Shot 2022-03-02 at 9.15.13 AM" style="zoom:50%;" />

6. Add info of OAuth consent screen

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.18.33 AM.png" alt="Screen Shot 2022-03-02 at 9.18.33 AM" style="zoom:50%;" />

7. Select scope (what user's data will be access by our app)

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.22.16 AM.png" alt="Screen Shot 2022-03-02 at 9.22.16 AM" style="zoom:50%;" />

8. Add testing users (or not)

   <img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.25.30 AM.png" alt="Screen Shot 2022-03-02 at 9.25.30 AM" style="zoom:50%;" />

9. Check summary and click "Back To Dashboard" button
10. Publish App

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.28.34 AM.png" alt="Screen Shot 2022-03-02 at 9.28.34 AM" style="zoom:50%;" />

11. Redo Step 4. Create Credentials -> OAuth client ID

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.13.07 AM.png" alt="Screen Shot 2022-03-02 at 9.13.07 AM" style="zoom:50%;" />

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.34.59 AM.png" alt="Screen Shot 2022-03-02 at 9.34.59 AM" style="zoom:40%;" />

Note: Authorised redirect URI is where " `Authorization Code Response` to" in OAuth flow chart

12. Now we have our Client ID and Client Secret (Both can be seen in credential later)

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 9.38.24 AM.png" alt="Screen Shot 2022-03-02 at 9.38.24 AM" style="zoom:33%;" />

## Passport.js

https://www.passportjs.org/

A thrid-party node package provide multiply solutions for authentication.

`npm install passport-google-oauth20` and `npm install passport`

#### server.js

```js
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');


require('dotenv').config();

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

app.use(passport.initialize())

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['email'],
  }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: false,
  }), 
  (req, res) => {
    console.log('Google called us back!');
  }
);

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
```

Passport.js handles below 3 steps for us.

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 12.55.31 PM.png" alt="Screen Shot 2022-03-02 at 12.55.31 PM" style="zoom:50%;" />

AccessToken will be passed from google to `verifyCallBack() `

## Cookies

Cookies are a way of storing data in browser that gets sent to the server whenever a request made against it. They are sent automatically.

<img src="Node Security & Authentication.assets/Screen Shot 2022-03-02 at 1.09.14 PM.png" alt="Screen Shot 2022-03-02 at 1.09.14 PM" style="zoom:50%;" />

## Sessions

We need sessions for the user data when we want to keep track of state that shouldn't be changed by the user in their browser directly. Unlike database, sessions are short lived until user quit or log out.

i.e. shopping cart might be in a session while order history might live in a database

Two ways of storing session data:

#### Server-side sessions (using Stateful cookies): 

user data lives in the server on a database, the data would get looked up for each request that the user makes and potentially deleted if the user logs out or quit their browser.

Server will look into database to check if the session is in database. Additional database read and write.

#### Client-side sessions (using Stateless cookies)(most cases):

Store session data in the browser cookies. (In fact, cookies are almost always used to implement sessions).

Server can encrypt or sign the user's cookies using a secret key before sent to the clients. Then server set the authenticated user an ID and send back the ID. Server using the secret key will know if the cookie has been tampered or not.

## express-session vs cookie-session

both are part of the Express.js organization and Express.js project on Github

#### 