<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.01.13 PM.png" alt="Screen Shot 2022-03-10 at 8.01.13 PM" style="zoom:50%;" />

need ONLY one request to get the all desired data from server.

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.23.27 PM.png" alt="Screen Shot 2022-03-10 at 8.23.27 PM" style="zoom:50%;" />

# GraphQL vs REST

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.29.07 PM.png" alt="Screen Shot 2022-03-10 at 8.29.07 PM" style="zoom:50%;" />

## Scenario:

As our user, we're browsing our store. And we're deciding if we want to purchase a pair of shoes to load those shoes. Product details for the user. First thing, we're going to need to get all the information on that individual product when we load the page for our shoes. We might make a request to the product's collection looking up our shoes by their ID. Our customer is satisfied with what they see, but they like some second opinions, so they scroll down the page and they load the product reviews to see what others have said about their pair of shoes. And we're on a limited budget, so maybe we want a notification or some sort of summary at the top of our screen telling us how many products we've already added to the cart and how much money we can expect to spend on those products so far. That would require a request to get the cart for our user. That's three requests. Three trips to the server.

## REST Problem: 

### Under-fetching

We lose time making extra unnecessary round trips between the server and the client, and we have to do more work querying multiple collections, which slows down our page load time.

### Over-fetching

Each of these requests might contain data that we don't need for our product page. i.e. /carts will give all details of products (we might only need the name and cost). We're sending unnecessary data from the server to the browser, and front end needs to filter the response from the server to get the only data that matters.

## GraphQL Solution:

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.39.03 PM.png" alt="Screen Shot 2022-03-10 at 8.39.03 PM" style="zoom:50%;" />

1. We ask for all the data we need in our query.
2. Pass it to the the single graphQL end point.
3. graphQL code wraps up all the data we need in the back end using functions calls `resolver`s
4. When all graphQL resolvers have gathered all the data we need, server sends back everything to front end.

Front end developers don't really care how end points are structured anymore.

Downside: The flexibility of the query language adds some complexity, might not be worth for simple applications.

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.48.46 PM.png" alt="Screen Shot 2022-03-10 at 8.48.46 PM" style="zoom:30%;" />

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.52.56 PM.png" alt="Screen Shot 2022-03-10 at 8.52.56 PM" style="zoom:30%;" />

# GraphQL in Node

`npm i graphql express-graphql`

```js
const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

//"!" means required
//there is no built in "date" type in graphql
//use OrderItem because we may order one product multiple times
const schema = buildSchema(`
    type Query {
        products: [Product]
        orders: [Order]
    }

    type Product {
        id: ID!
        description: String!
        reviews: [Review]
        price: Float!
    }

    type Review {
        rating: Int!
        comment: String
    }

    type Order {
        date: String!
        subtotal: Float!
        items: [OrderItem]
    }

    type OrderItem {
        product: Product!
        quantity: Int!
    }
`)


const root = {
    products: [
        {
            id: 'redshoe',
            description: 'Red Shoe',
            price: 42.12
        },
        {
            id: 'bluejean',
            description: 'Blue Jeans',
            price: 55.55,
        }
    ],
    orders: [
        {
            date: '2005-05-05',
            subtotal: 90.22,
            items: [
                {
                    product: {
                        id: 'redshoe',
                        description: 'Old Red Shoe',
                        price: 45.11,
                    },
                    quantity: 2,
                }
            ]
        }
    ]
}

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,// make a GET request to /graphql to get into graphiql IDE
}))

app.listen(3000, () => {
    console.log('Running GraphQL server...')
})
```

<img src="GraphQL.assets/Screen Shot 2022-03-11 at 7.49.12 PM.png" alt="Screen Shot 2022-03-11 at 7.49.12 PM" style="zoom:50%;" />

## GraphQL Tools

`npm i @graphql-tools/schema`

` npm i @graphql-tools/load-files`

<img src="GraphQL.assets/Screen Shot 2022-03-11 at 8.10.14 PM.png" alt="Screen Shot 2022-03-11 at 8.10.14 PM" style="zoom:50%;" />

#### server.js

```js
const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

//"**" means look into any directories or subdirectories
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'))

const schema = makeExecutableSchema({
    typeDefs: typesArray
})

const root = {
    products: require('./products/products.model'),
    orders: require('./orders/orders.model')
}

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,// make a GET request to /graphql to get into graphiql IDE
}))

app.listen(3000, () => {
    console.log('Running GraphQL server...')
})

```

#### orders/orders.graphql

```
type Query {
    orders: [Order]
}
type Order {
    date: String!
    subtotal: Float!
    items: [OrderItem]
}

type OrderItem {
    product: Product!
    quantity: Int!
}
```

#### products/products.graphql

```
type Query {
    products: [Product]
}
type Product {
    id: ID!
    description: String!
    reviews: [Review]
    price: Float!
}

type Review {
    rating: Int!
    comment: String
}
```

Note: type Query have the both products field and orders field, `loadFilesSync()` will combine them together.

#### orders/order.model.js

```js
module.exports = [
    {
        date: '2005-05-05',
        subtotal: 90.22,
        items: [
            {
                product: {
                    id: 'redshoe',
                    description: 'Old Red Shoe',
                    price: 45.11,
                },
                quantity: 2,
            }
        ]
    }
]
```

#### products/product.model.js

```js
module.exports = [
    {
        id: 'redshoe',
        description: 'Red Shoe',
        price: 42.12
    },
    {
        id: 'bluejean',
        description: 'Blue Jeans',
        price: 55.55,
    }
]
```

## Resolver

```js
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'))

const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: {
        Query: {
          //parent is the passed in values, i.e. rootValue
          //args used for parameterized queries,i.e. filter the result
          //context used for data that shared among different resolvers.i.e. pass down authentication data to every resolvers
          //info used for current state of operation
            products: async (parent, args, context, info) => {
                console.log('Getting the products...')
                const product = await Promise.resolve(parent.products)
                return product;
            },
            orders: (parent) => {
                console.log('Getting the orders...')
                return parent.orders
            }
        }
    }
})
```

### Modularizing Resolvers

<img src="GraphQL.assets/Screen Shot 2022-03-14 at 11.40.14 AM.png" alt="Screen Shot 2022-03-14 at 11.40.14 AM" style="zoom:33%;" />

#### Server.js

```js
//----------------------------------
//"**" means look into any directories or subdirectories
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'))
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'))

const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
})

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,// make a GET request to /graphql to get into graphiql IDE
}))
//-----------------------------------
```

#### orders.model.js

```js
const orders = [
    {
        date: '2005-05-05',
        subtotal: 90.22,
        items: [
            {
                product: {
                    id: 'redshoe',
                    description: 'Old Red Shoe',
                    price: 45.11,
                },
                quantity: 2,
            }
        ]
    }
]

const getAllOrders = () => {
    return orders;
}

module.exports = {
    getAllOrders
};
```

#### orders.resolver.js

```js
const ordersModel = require('./orders.model');

module.exports = {
    Query: {
        orders: () => {
            return ordersModel.getAllOrders();
        }
    }
};
```

### Filtering with Queries and Resolvers

#### products.resolvers.js

```js
const productsModel = require('./products.model');

module.exports = {
    Query: {
        products: () => {
            return productsModel.getAllProducts();
        },
        productsByPrice: (_, args) => {
            return productsModel.getProductsByPrice(args.min, args.max)
        }
    }
};
```

Note: use  `_` as a placeholder for args that we don't use, code above we don't use "parent", so we use "_" instead

#### products.graphql

```
type Query {
    products: [Product]
    productsByPrice(min: Float!, max: Float!): [Product]
    product(id: String!): Product
}
type Product {
    id: ID!
    description: String!
    reviews: [Review]
    price: Float!
}

type Review {
    rating: Int!
    comment: String
}
```

#### products.model.js

```js
const products = [
    {
        id: 'redshoe',
        description: 'Red Shoe',
        price: 42.12
    },
    {
        id: 'bluejean',
        description: 'Blue Jeans',
        price: 55.55,
    }
]

const getAllProducts = () => {
    return products
}

const getProductsByPrice = (min, max) => {
    return products.filter((product) => {
        return product.price >= min && product.price <= max
    })
}

const getProductById = (id) => {
    return products.find ((product)=>{
        return product.id === id;
    })
}

module.exports = {
    getAllProducts,
    getProductsByPrice,
    getProductById,
};
```

<img src="GraphQL.assets/Screen Shot 2022-03-14 at 12.12.56 PM.png" alt="Screen Shot 2022-03-14 at 12.12.56 PM" style="zoom:50%;" />

## Mutations

When we do changes of the data on server, we use mutations

#### products.graphql

```
type Mutation {
  addNewProduct(id: ID!, description: String!, price: Float!): Product
  addNewProductReview(id: ID!, rating: Int!, comment: String): Review
}
```

#### products.model.js

```js
//-------------------
const addNewProduct = (id, description, price) => {
  const newProduct = {
    id,
    price,
    description,
    reviews: [],
  };
  products.push(newProduct);
  return newProduct;
};

const addNewProductReview = (id, rating, comment) => {
  const matchedProduct = getProductById(id);
  if (!matchedProduct) return;
  const newProductReview = {
    rating,
    comment,
  };
  matchedProduct.reviews.push(newProductReview);
  return newProductReview;
};

module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addNewProduct,
  addNewProductReview,
};
```

#### products.resolvers.js

```js
const productsModel = require("./products.model");

module.exports = {
  Query: {
    products: () => {
      return productsModel.getAllProducts();
    },
    productsByPrice: (_, args) => {
      return productsModel.getProductsByPrice(args.min, args.max);
    },
    product: (_, args) => {
      return productsModel.getProductById(args.id);
    },
  },
  Mutation: {
    addNewProduct: (_, args) => {
      return productsModel.addNewProduct(args.id, args.description, args.price);
    },
    addNewProductReview: (_, args) => {
      return productsModel.addNewProductReview(
        args.id,
        args.rating,
        args.comment
      );
    },
  },
};
```

<img src="GraphQL.assets/Screen Shot 2022-03-14 at 1.02.56 PM.png" alt="Screen Shot 2022-03-14 at 1.02.56 PM" style="zoom:50%;" />

Note: use `mutation` in query instead of `query`

<img src="GraphQL.assets/Screen Shot 2022-03-14 at 1.04.07 PM.png" alt="Screen Shot 2022-03-14 at 1.04.07 PM" style="zoom:50%;" />