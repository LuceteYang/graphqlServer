import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const bookks = [
  { title: "문제는 경제다", author: "김개동" },
  { title: "82년생 김지영", author: "김지영" },
  { title: "83년생 김지영", author: "김지영" },
  { title: "84년생 김지영", author: "김지영" },
  { title: "88만원 세대", author: "유시민" }
];
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
`;

// 실제 처리 정의
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    books: () => bookks,
    findBook: (obj, args) => {
      return bookks.filter(b => {
        return b.author === args.name;
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
