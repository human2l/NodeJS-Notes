# SQL vs NoSQL

<img src="Databases.assets/Screen Shot 2022-02-25 at 8.51.57 PM.png" alt="Screen Shot 2022-02-25 at 8.51.57 PM" style="zoom:50%;" />

MongoDB save data as BSON(binary encoded JSON), we dont need to do Object-relational impedance mismatch, easy horizontal scaling

SQL implements ACID transactions, every changes will be in a transaction, update successfully or rolled back

<img src="Databases.assets/Screen Shot 2022-02-25 at 9.30.13 PM.png" alt="Screen Shot 2022-02-25 at 9.30.13 PM" style="zoom:50%;" />

<img src="Databases.assets/Screen Shot 2022-02-25 at 9.34.09 PM.png" alt="Screen Shot 2022-02-25 at 9.34.09 PM" style="zoom:20%;" />

# MongoDB

# MongoDB-Atlas

The cloud version of mongoDB

### Database Access

Set up users with privileges to access the database

#### Principle of Least Privilege

A subject should be given only those privileges needed for it to complete its task

### Network Access

Configure which IP addresses can access your cluster.

<img src="Databases.assets/Screen Shot 2022-02-26 at 12.44.38 PM.png" alt="Screen Shot 2022-02-26 at 12.44.38 PM" style="zoom:50%;" />

In production, we should only give access to the IP of server. In development, we can allow access from anywhere.

## Mongoose

Get connection string:

<img src="Databases.assets/Screen Shot 2022-02-26 at 2.04.46 PM.png" alt="Screen Shot 2022-02-26 at 2.04.46 PM" style="zoom:50%;" />

`npm install mongoose`

modify connection string to`mongodb+srv://MASAUser1:MASAUser1@masa-cluster.5dxpc.mongodb.net/masa?retryWrites=true&w=majority`

```js
const http = require("http");
const mongoose = require('mongoose');

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://MASAUser1:MASAUser1@masa-cluster.5dxpc.mongodb.net/masa?retryWrites=true&w=majority'

const server = http.createServer(app);

//mongoose.connection is an event emitter that emits events when connection is ready
//"once" instead of "on": will only trigger at the first time
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready')
})
mongoose.connection.on('error', (err) => {
  console.error(err)
})

const startServer = async () => {
  await mongoose.connect(MONGO_URL)
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
```

**MongoDB Driver** is the official API that node uses to talk to Mongo databases.

## Mongoose Schema

<img src="Databases.assets/Screen Shot 2022-02-26 at 3.04.40 PM.png" alt="Screen Shot 2022-02-26 at 3.04.40 PM" style="zoom:50%;" />

## Mongoose Schema Types

Reference: [SchemaTypes](https://mongoosejs.com/docs/schematypes.html).

The permitted SchemaTypes are:

- [String](https://mongoosejs.com/docs/schematypes.html#strings)
- [Number](https://mongoosejs.com/docs/schematypes.html#numbers)
- [Date](https://mongoosejs.com/docs/schematypes.html#dates)
- [Buffer](https://mongoosejs.com/docs/schematypes.html#buffers)
- [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)
- [Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)
- [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)
- [Array](https://mongoosejs.com/docs/schematypes.html#arrays)
- [Decimal128](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Decimal128)
- [Map](https://mongoosejs.com/docs/schematypes.html#maps)

## Schema Type Options

Reference: [SchemaTypeOptions](https://mongoosejs.com/docs/schematypes.html#schematype-options)

##### All Schema Types

- `required`: boolean or function, if true adds a [required validator](https://mongoosejs.com/docs/validation.html#built-in-validators) for this property
- `default`: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
- `select`: boolean, specifies default [projections](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/) for queries
- `validate`: function, adds a [validator function](https://mongoosejs.com/docs/validation.html#built-in-validators) for this property
- `get`: function, defines a custom getter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).
- `set`: function, defines a custom setter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).
- `alias`: string, mongoose >= 4.10.0 only. Defines a [virtual](https://mongoosejs.com/docs/guide.html#virtuals) with the given name that gets/sets this path.
- `immutable`: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has `isNew: true`.
- `transform`: function, Mongoose calls this function when you call [`Document#toJSON()`](https://mongoosejs.com/docs/api/document.html#document_Document-toJSON) function, including when you [`JSON.stringify()`](https://thecodebarbarian.com/the-80-20-guide-to-json-stringify-in-javascript) a document.

##### Indexes

You can also define [MongoDB indexes](https://docs.mongodb.com/manual/indexes/) using schema type options.

- `index`: boolean, whether to define an [index](https://docs.mongodb.com/manual/indexes/) on this property.
- `unique`: boolean, whether to define a [unique index](https://docs.mongodb.com/manual/core/index-unique/) on this property.
- `sparse`: boolean, whether to define a [sparse index](https://docs.mongodb.com/manual/core/index-sparse/) on this property.

##### String

- `lowercase`: boolean, whether to always call `.toLowerCase()` on the value
- `uppercase`: boolean, whether to always call `.toUpperCase()` on the value
- `trim`: boolean, whether to always call [`.trim()`](https://masteringjs.io/tutorials/fundamentals/trim-string) on the value
- `match`: RegExp, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value matches the given regular expression
- `enum`: Array, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is in the given array.
- `minLength`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value length is not less than the given number
- `maxLength`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value length is not greater than the given number
- `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)

##### Number

- `min`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is greater than or equal to the given minimum.
- `max`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is less than or equal to the given maximum.
- `enum`: Array, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is strictly equal to one of the values in the given array.
- `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)

##### Date

- `min`: Date
- `max`: Date

##### ObjectId

- `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)

## Create Mongoose Schema

#### planets.mongo.js

```js
const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
})

// Connects launchesSchema with the "planet" collection
module.exports = mongoose.model('Planets', planetsSchema);
```

## Creating and Inserting Documents

### Find

`find()`

[Model.find()](https://mongoosejs.com/docs/api/model.html#model_Model.find)

```js
const planets = require('./planets.mongo')

//find data with keplerName 'Kepler-62 f', include anotherField field, exclude keplerName field
planets.find({
  	keplerName: 'Kepler-62 f',
	},'-keplerName anotherField'
)
```

### Upsert

`upsert()` = `insert()` + `update()`

[Model.updateOne()](https://mongoosejs.com/docs/api.html#model_Model.updateOne)

Only add when doesn't exist, or update exist item

```js
try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    },{
      keplerName: planet.kepler_name,
    },{
      upsert: true,
    })
  } catch (error) {
    console.error(`Could not save planet, ${error}`)
  }
```

## Fields in one record of data

<img src="Databases.assets/Screen Shot 2022-02-26 at 6.56.59 PM.png" alt="Screen Shot 2022-02-26 at 6.56.59 PM" style="zoom:50%;" />

###  MongoDB ObjectId

[ObjectId-Timestamp Converter](https://steveridout.github.io/)

<img src="Databases.assets/Screen Shot 2022-02-26 at 6.59.18 PM.png" alt="Screen Shot 2022-02-26 at 6.59.18 PM" style="zoom:50%;" />

Note: With Mongo, no need to save the creation date of documents, because that's built in to how Mongo store Id

### Mongoose Version Key

`__v:[version]`

This key-value contains the internal revision of the document. It is the version of Schema

