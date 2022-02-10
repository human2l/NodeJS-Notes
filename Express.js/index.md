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

# Handle Routes

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

### Exact maching

filter by method, such as`.get("/")`is exact maching, will only match route "/"

`.use("/")`will match all of the routes

# Parsing Incoming Requests

`npm install --save body-parser`

`const bodyParser = require("body-parser");`

`app.use(bodyParser.urlencoded({ extended: false }));`

use `app.post()`to filter only POST request will use this middleware

```js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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

# Using Express Router

Create "routes" folder

<img src="index.assets/Screen Shot 2022-02-10 at 1.13.24 PM.png" alt="Screen Shot 2022-02-10 at 1.13.24 PM" style="zoom:50%;" align="left"/>

## admin.js

* import and create express router

* use router.get() etc.

* export router

```js
const express = require("express");
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  console.log("users middleware");
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></input></form>'
  );
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
```

## app.js

* import router
* app.use() apply router middleware

```js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3001);
```

# 404 Error Page

## app.js

```js
//move below to the bottom of all app.use(), because it should be the last middleware after routing all of other routes
app.use((req,res,next) => {
	res.status(404).send('<h1>Page not found</h1>')
})
```

# Filtering Path

## app.js

extract the common parent path '/admin'

```js
app.use('/admin', adminRoutes);
```

## admin.js

```js
router.get("/product", (req, res, next) => {
});

router.post("/add-product", (req, res, next) => {
});
```

Now when user access `/admin/product` and `/admin/add-product`

# Serve HTML Pages

<img src="index.assets/Screen Shot 2022-02-10 at 9.20.11 PM.png" alt="Screen Shot 2022-02-10 at 9.20.11 PM" style="zoom:50%;" align="left"/>

## shop.js

`res.sendFile('/views/shop.html')`

Problem: the first "/" refers to the folder of operating system, not the folder of app.js or shop.js

Solution:

```js
const path = require('path');
router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
});
```

Note: `__dirname`refers the folder that current file in. `..`means go to the parent folder

# Path Helper Function

<img src="index.assets/Screen Shot 2022-02-10 at 9.37.53 PM.png" alt="Screen Shot 2022-02-10 at 9.37.53 PM" style="zoom:50%;" align="left"/>

## path.js

```js
const path = require('path');
module.exports = path.dirname(require.main.filename);
//require.main.filename gives the file that app is running
//dirname will give the path of directory
```

## shop.js

```js
const path = require('path');
const rootDir = require('../util/path');
router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});
//now rootDir can be used as root directory
```

# Serve Files Statically

<img src="index.assets/Screen Shot 2022-02-10 at 10.15.45 PM.png" alt="Screen Shot 2022-02-10 at 10.15.45 PM" style="zoom:50%;" align="left"/>

If we want html page uses external css file, we need to let the html page have access to file system.

grand read access (read only) to `public`folder:

```js
app.use(express.static(path.join(__dirname, "public")));
```

## shop.html

```html
<link rel="stylesheet" href="/css/main.css" />
```

now express will try to find `/css/main.css` inside `public` folder

# Summary

<img src="index.assets/Screen Shot 2022-02-10 at 11.01.40 PM.png" alt="Screen Shot 2022-02-10 at 11.01.40 PM" style="zoom:50%;" />

# Resources

Express.js official: https://expressjs.com/en/starter/installing.html