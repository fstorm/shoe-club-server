const gql = require('graphql-tag');
const { ApolloServer } = require('apollo-server');

const typeDefs = gql`
  # union Footware = Sneaker | Boot

  enum ShoeType {
    NIKE
    JORDAN
    GEORGE
    dan
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
    user: User
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User
    sport: Boolean!
  }

  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User
    colour: String!
  }

  type User {
    email: String!
    avatar: String
    friends: [User]!
    shoes: [Shoe]!
    id: ID!
  }

  input ShoeInput {
    brand: ShoeType
    size: Int
  }

  input NewShoeInput {
    brand: ShoeType!
    size: Int!
  }

  type Query {
    me: User!
    shoe(input: ShoeInput): [Shoe]!
  }

  type Mutation {
    newShoe(input: NewShoeInput!): Shoe!
  }
`;

const shoes = [
  {
    brand: 'NIKE',
    size: 38,
    sport: true,
    user: 1,
  },
  {
    brand: 'GEORGE',
    size: 42,
    colour: 'red',
    user: 1,
  },
];

const user = {
  email: 'example@ex.com',
  avatar: 'https://exmaple.com',
  friends: [],
  shoes: shoes,
  id: 1,
};

const resolvers = {
  Query: {
    shoe(_, { input }) {
      return shoes;
    },
    me() {
      return user;
    },
  },
  Mutation: {
    newShoe(_, { input }) {
      return input;
    },
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) return 'Sneaker';
      return 'Boot';
    },
  },
  Sneaker: {
    user(shoe) {
      // we know that the first argument is shoe because its resolved under the shoe type
      return user;
    },
  },
  Boot: {
    user(shoe) {
      // we know that the first argument is shoe because its resolved under the shoe type
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4002).then(() => console.log('Listening on port 4002'));
