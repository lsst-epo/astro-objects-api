const { ApolloServer, gql } = require('apollo-server-cloud-functions');

const astroObjects = [
    {
        "_RA": "105.374159968744",
        "_DEC": "3.6632731625161057",
        "_score": "15.134748520178348",
        "type": "transient",
        "distance": "50.43161619195369",
        "brightness": "93.06833725509975",
        "id": "1625694851590",
        "img": "https://placem.at/places?w=600&h=600&random=1",
        "position": [
            240,
            649
        ]
    },
    {
        "_RA": "108.27861683328074",
        "_DEC": "3.273173647302116",
        "_score": "49.7606149305725",
        "type": "star",
        "distance": "34.69529616168743",
        "brightness": "18.02614672442935",
        "id": "1626898810661",
        "img": "https://placem.at/places?w=600&h=600&random=1",
        "position": [
            252,
            560
        ]
    },
    {
        "_RA": "111.82494246845405",
        "_DEC": "4.749637886041583",
        "_score": "42.63006448499661",
        "type": "nebula",
        "distance": "76.74921695237742",
        "brightness": "11.559622710926853",
        "id": "1626898990318",
        "img": "https://placem.at/places?w=600&h=600&random=1",
        "position": [
            208,
            452
        ]
    },
    {
        "_RA": "107.53428190352513",
        "_DEC": "-1.7901666978816166",
        "_score": "86.77799393870464",
        "type": "galaxy",
        "distance": "1.4424391663327096",
        "brightness": "65.04451381658522",
        "id": "1626898921305",
        "img": "https://placem.at/places?w=600&h=600&random=1",
        "position": [
            407,
            583
        ]
    },
    {
        "_RA": "118.5143652235916",
        "_DEC": "-9.990185166715662",
        "_score": "-61.014507311252686",
        "type": "star",
        "distance": "61.08139587392798",
        "brightness": "44.45793463222345",
        "id": "1626898810659",
        "img": "https://placem.at/places?w=600&h=600&random=1",
        "position": [
            658,
            255
        ]
    }
]

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type AstroObject {
        id: ID!
        distance: Float!
        brightness: Float!
        _RA: Float!
        _DEC: Float!
        _score: Float!
        type: String!
        img: String!
        position: [Int!]!
    }

    type Query {
        astroObjects(id: ID!): AstroObject
    }
`;



// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    astroObjects(parent, args, context, info) { 
        let ob = astroObjects.find(astroObj => astroObj.id == args.id);
        console.log(ob);
        return ob;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
