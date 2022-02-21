# Disable server-side routing for SPA

```js
 app.use(express.static(path.join(__dirname, 'build')));

-app.get('/', function (req, res) {
+app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });
```

Reference: https://create-react-app.dev/docs/deployment

# npm scripts

### package.json

```json
{
  "scripts" : {
  	"install-server": "npm install -prefix server",
    "install-client": "npm install -prefix client",
    "install": "npm run install-server && npm run install-client",//run install-server then run install-client one after another
    "build-client": "npm run build --prefix client",
    "server": "npm run watch --prefix server",
    "client": "npm start --prefix client",
    "watch": "npm run server & npm run client",//run both server and client parallelly
    "deploy": "npm run build --prefix client && npm start --prefix server",
    "test": "npm run test --prefix server && npm run test --prefix client"
	}
}
```

### client/package.json

```json
"scripts": {
    "start": "react-scripts start",
    "build": "BUILD_PATH=../server/public react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

### server/package.json

```json
"scripts": {
    "watch": "nodemon src/server.js",
    "start": "PORT=8000 node src/server.js"
  },
```

