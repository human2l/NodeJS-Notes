# Versioning Node APIs

#### routes/api.js

```js
const express = require('express');

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;
```

### app.js

```js
const api = require('./routes/api');

app.use('/v1', api)
// now the url will be /v1/planets
```

above using first version as `v1` 

Versioning APIs can allow users access both new and old version of API at the same time, so that when we provide a new version of API, users will not lose connection instantly. They can update their code later (or keep using the old one)

# Axios

# Node Pagination

## Pagination API Request

```js
#SpaceX REST API
POST https://api.spacexdata.com/v4/launches/query HTTP/1.1
content-type: application/json

{
    "query": {},
    "options": {
        "page": 2,
        "limit":20,
        "populate": [
            {
                "path": "rocket",
                "select": {
                    "name": 1
                }
            },
            {
                "path": "payloads",
                "select": {
                    "customers": 1
                }
            }
        ]
    }
  }
```

```js
#SpaceX REST API
POST https://api.spacexdata.com/v4/launches/query HTTP/1.1
content-type: application/json

{
    "query": {},
    "options": {
        "pagination": false,
        "populate": [
            {
                "path": "rocket",
                "select": {
                    "name": 1
                }
            },
            {
                "path": "payloads",
                "select": {
                    "customers": 1
                }
            }
        ]
    }
  }
```

## Paginating response

#### services/query.js

```js
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

const getPagination = (query) => {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    }
}

module.exports = {
    getPagination,
}
```

#### models/launches.model.js

```js
const getAllLaunches = async (skip, limit) => {
  return await launchesDatabase
    .find({}, "-_id -__v")
  	//to sort in decend order, use "-flightNumber"
    .sort("flightNumber")
    .skip(skip)
    .limit(limit)
}
```

#### routes/launches/launches.controller.js

```js
const httpGetAllLaunches = async (req,res) => {
    const { skip, limit } = getPagination(req.query);
	  //MongoDB will return data base on "skip" and "limit"
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);
}
```

# Managing Secrets with Dotenv

`npm install dotenv`

Create a file in `/server` called `.env`

#### .env

```
PORT = 5000;
MONGO_URL = "[url to connect to mongoDB]"
```

configurations inside `.env` will be added into `process.env` to be used by other modules

#### server.js

```js
//This should above all other requires
require('dotenv').config();
```

