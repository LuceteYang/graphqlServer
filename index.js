import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import mongoose, { mongo } from "mongoose";

mongoose
  .connect("mongodb://localhost/graphql", { useNewUrlParser: true })
  .then(() => {
    console.log("몽구스 연결 성공");
  })
  .catch(err => {
    console.log("err", err);
  });

const Book = mongoose.model("book", { title: String, author: String });

// dummy data
// const bookks = [
//   { title: "문제는 경제다", author: "김개동" },
//   { title: "82년생 김지영", author: "김지영" },
//   { title: "83년생 김지영", author: "김지영" },
//   { title: "84년생 김지영", author: "김지영" },
//   { title: "88만원 세대", author: "유시민" }
// ];
// bookks.forEach(item=>{
//     new Book(item).save()
// })

// 타입 정의
const typeDefs = gql`
  type Query {
    hello: String
    books: [Book]
    findBook(name: String): [Book]
  }
  type Book {
    title: String
    author: String
  }
  type Mutation {
    addBook(title: String, author: String): Book
  }
`;
// 실제 처리 정의
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    books: async (obj, args, ctx) => {
      return await ctx.book.find();
    },
    findBook: async (obj, args, ctx) => {
      return await ctx.book.find({ author: args.name });
    }
  },
  Mutation: {
    addBook: async (obj, args, ctx) => {
      return await new ctx.book(args).save();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { book: Book }
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
