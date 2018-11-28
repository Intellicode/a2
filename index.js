const { GraphQLServer } = require('graphql-yoga');

const flights = [
  {
    number: 'KL0001',
    destinationId: 1,
    originId: 4,
    airplaneId: 1,
    departure: '2012-07-14T01:00:00Z',
    arrival: '2012-07-14T09:00:00Z',
  },
  {
    number: 'KL0002',
    destinationId: 4,
    originId: 3,
    airplaneId: 1,
    departure: '2012-07-14T02:00:00Z',
    arrival: '2012-07-14T03:00:00Z',
  },
  {
    number: 'KL0003',
    destinationId: 1,
    originId: 3,
    airplaneId: 1,
    departure: '2012-07-14T00:00:00Z',
    arrival: '2012-07-15T09:00:00Z',
  },
];

const airplanes = [
  {
    id: 1,
    name: 'Boeing 737-200',
  },
  {
    id: 2,
    name: 'Airbus A320-200',
  },
  {
    id: 3,
    name: 'Boeing 777',
  },
  {
    id: 4,
    name: 'Boeing 787 Dreamliner',
  },
  {
    id: 5,
    name: 'Airbus A380-800',
  },
];

const airports = [
  {
    id: 1,
    name: 'AMS',
  },
  {
    id: 2,
    name: 'NRT',
  },
  {
    id: 3,
    name: 'JFK',
  },
  {
    id: 4,
    name: 'LHR',
  },
];

const typeDefs = `
    type Query {
        flights(sortBy: SortBy): [Flight!]!
        airports: [Airport!]!
        airplanes: [Airplane!]!
    }

    type Mutation {
        addFlight(flight: AddFlightInput!): Flight!
    }

    type Airport {
        id: ID!
        name: String!
    }

    type Airplane {
        id: ID!
        name: String!
    }

    input AddFlightInput {
        number: ID!
        destinationId: ID!
        originId: ID!
        airplaneId: ID!
        departure: String!
        arrival: String!
    }

    type Flight {
        number: ID!
        destination: Airport!
        origin: Airport!
        airplane: Airplane!
        departure: String!
        arrival: String!
    }

    enum SortBy {
        DEPARTURE,
        ARIVAL
    }
`;

/*
JavaScript quick intro 

Anonymous functions
const fun = (param) => param; // gets a param, returns a param
const fun = (param) => { return param; }; // Same as above but long-form, for multiline functions

Array functions
Array.find(function(item)) // Returns a an item matching the predicate, function should return a boolean
Array.filter(function(item)) // Returns an array of items matching the filter predicate, function should return a boolean
Array.map(function(item)) // Iterates over the array and applies the function to each element and returns the result in a new array
Array.reduce(function(acc, item), init) // Iterates over the array and accumulates the result of the function into the first argument
Array.slice(start, end) // returns a selection of the array from start until the end
Array.sort(function(a, b)) // Sorts the array (inplace!) based on the outcome of the function, the function should return -1, 0 or 1
                           // make sure to create a copy [...arr].sort(...)
Array.reverse() // reverses an Array

See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
*/

const resolvers = {
  Query: {
    flights: (_, { sortBy }) => {
      if (!sortBy) return flights;

      const field = sortBy === 'DEPARTURE' ? 'departure' : 'arrival';

      return [...flights].sort(
        (a, b) => new Date(a[field]) - new Date(b[field])
      );
    },
    airplanes: () => airplanes,
    airports: () => airports,
  },
  Mutation: {
    addFlight: (_, { flight }) => flights.push(flight) && flight,
  },
  Flight: {
    airplane: flight =>
      airplanes.find(airplane => airplane.id === flight.airplaneId),
    destination: flight =>
      airports.find(airport => airport.id === flight.destinationId),
    origin: flight => airports.find(airport => airport.id === flight.originId),
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({ port: process.env.PORT || 4000 }, () => console.log(`Server is running on ${process.env.PORT || 4000}`));
