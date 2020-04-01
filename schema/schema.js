const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

var books = [
  {name: 'qwerty1',genre: 'oppo1',id: '1', authorid: '12'},
  {name: 'qwerty2',genre: 'oppo2',id: '2', authorid: '13'},
  {name: 'qwerty3',genre: 'oppo3',id: '3', authorid: '11'},
  {name: 'qwerty4',genre: 'oppo3',id: '4', authorid: '11'},
  {name: 'qwerty5',genre: 'oppo3',id: '5', authorid: '11'},
  {name: 'qwerty6',genre: 'oppo3',id: '6', authorid: '11'},
  {name: 'qwerty7',genre: 'oppo2',id: '7', authorid: '12'},
  {name: 'qwerty8',genre: 'oppo2',id: '8', authorid: '13'},
  {name: 'qwerty9',genre: 'oppo1',id: '9', authorid: '13'},
];

var authors = [
  {name: 'singli1',age: 22,id:'11'},
  {name: 'mangli',age: 32,id:'12'},
  {name: 'lingli',age: 42,id:'13'},
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type:GraphQLString},
    genre: {type:GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args){
        console.log(parent.authorid);
        // return _.find(authors,{id: parent.authorid});
        return Author.findById(parent.authorId)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type:GraphQLString},
    age: {type:GraphQLInt},
    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return _.filter(books, {authorid: parent.id})
        return Book.find({authorId: parent.id})
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    book:{
      type: BookType,
      args: {id:{type: GraphQLID}},
      resolve(parent, args){
        // console.log(typeof args.id);
        // return _.find(books,{id: args.id});
        return Book.findById(args.id);
      }
    },
    author:{
      type: AuthorType,
      args: {id:{type: GraphQLID}},
      resolve(parent, args){
        // console.log(typeof args.id);
        // return _.find(authors,{id: args.id});
        return Author.findById(args.id)
      }
    },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find();
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        // return authors;
        return Author.find();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    addAuthor:{
      type: AuthorType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook:{
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorid: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorid
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query:RootQuery,
  mutation: Mutation
});
