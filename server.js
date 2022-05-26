import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "hello one",
    userId: "2",
  },
  {
    id: "2",
    text: "hello two",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName and lastname as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet.
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else return false.
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("Allusers called!");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.findIndex((user) => user.id === userId);
      console.log(user);
      if (user !== -1) {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      } else return;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
