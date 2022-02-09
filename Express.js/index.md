<img src="index.assets/Screen Shot 2022-01-07 at 6.37.38 PM.png" alt="Screen Shot 2022-01-07 at 6.37.38 PM" style="zoom:40%;" />

<img src="index.assets/Screen Shot 2022-02-09 at 3.54.45 PM.png" alt="Screen Shot 2022-02-09 at 3.54.45 PM" style="zoom:50%;" />

<img src="index.assets/Screen Shot 2022-02-09 at 3.56.12 PM.png" alt="Screen Shot 2022-02-09 at 3.56.12 PM" style="zoom:50%;" />

`npm install --save express`

# Middleware

<img src="index.assets/Screen Shot 2022-02-09 at 4.04.49 PM.png" alt="Screen Shot 2022-02-09 at 4.04.49 PM" style="zoom:50%;" />

```js
const http = require('http');
const express = require('express');
const app = express();

//"use" means we add a middleware, the function we passed in(request handler) will be executed for every incoming request
app.use((req, res, next) => {
  next();//Allows the request to continue to the next middleware
})

//Below is another middleware
app.use((req, res, next) => {
  //res.setHeader('') can overwrite the header, default is "text/html"
	res.send();// param can be any, i.e. html
})

//const server = http.createServer(app);
//server.listen(3000);
//app.listen done the two lines above for us
app.listen(3000);
```

## Handle Routes

```js
app.use('/', (req,res, next) => {
	console.log("This always runs!")
  next();
})

app.use('/add-product', (req,res, next) => {
	res.send('<h1>Add Product Page</h1>')
})

//put the "/" path as the last one, or it will direct to "/" always, because "/" match first
app.use('/', (req,res, next) => {
	res.send('<h1>default path</h1>')
})
```

Note: never call `next()`after sending arespond, or it will call the next middleware, create conflix

## Parsing Incoming Requests

`npm install --save body-parser`

`const bodyParser = require("body-parser");`

`app.use(bodyParser.urlencoded({ extended: false }));`

use `app.post()`to filter only post request will use this middleware

```js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
  console.log("users middleware");
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></input></form>'
  );
});

app.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>home</h1>");
});

app.listen(3000);
```

#### add-product page:

<img src="index.assets/Screen Shot 2022-02-09 at 9.41.49 PM.png" alt="Screen Shot 2022-02-09 at 9.41.49 PM" style="zoom:50%;" align="left"/>

#### server console:

`[Object: null prototype] { title: 'aaa' }`

