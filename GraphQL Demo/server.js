const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

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

app.listen(3000, () => {
    console.log('Running GraphQL server...')
})
