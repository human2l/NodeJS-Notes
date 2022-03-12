const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

//"**" means look into any directories or subdirectories
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'))

const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: {
        Query: {
            products: async (parent) => {
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
