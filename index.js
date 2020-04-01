const express = require('express');
const graphqlHTTP = require('express-graphql');
const port = 3200;
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/graphqldb');
mongoose.connection.once('open',() => {
  console.log('connection to mongodb is established' + '\x1b[0m');
  console.log('-------------------------------------------------------------------------\n');
})

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(port, () => {
  console.log('\n-------------------------------------------------------------------------');
  console.log('\x1b[35m' + 'connection established on localhost:' + port)
})
