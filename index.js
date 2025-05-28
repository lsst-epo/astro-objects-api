const { ApolloServer, gql } = require('apollo-server-cloud-functions');
const Knex = require('knex');
const { Logging } = require('@google-cloud/logging');

// Set up a variable to hold our connection pool. It would be safe to
// initialize this right away, but we defer its instantiation to ease
// testing different configurations.
let pool;
const PROJECT_ID = "skyviewer";
const LOG_NAME = "astro-object-api"
// create the logging  client
const logging = new Logging( { PROJECT_ID } );
// Selects the log to write to
const log = logging.logSync(LOG_NAME);


const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(pool => {
      return pool;
    })
    .catch(err => {
      throw err;
    });

// Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
const createPool = async () => {
    // Configure which instance and what database user to connect with.
    // Remember - storing secrets in plaintext is potentially unsafe. Consider using
    // something like https://cloud.google.com/kms/ to help keep secrets secret.
    const config = {pool: {}};
  
    // [START cloud_sql_postgres_knex_limit]
    // 'max' limits the total number of concurrent connections this pool will keep. Ideal
    // values for this setting are highly variable on app design, infrastructure, and database.
    config.pool.max = 5;
    // 'min' is the minimum number of idle connections Knex maintains in the pool.
    // Additional connections will be established to meet this value unless the pool is full.
    config.pool.min = 5;
    // [END cloud_sql_postgres_knex_limit]
  
    // [START cloud_sql_postgres_knex_timeout]
    // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
    // connection from the pool. This is slightly different from connectionTimeout, because acquiring
    // a pool connection does not always involve making a new connection, and may include multiple retries.
    // when making a connection
    config.pool.acquireTimeoutMillis = 60000; // 60 seconds
    // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
    // initial connection before retrying.
    // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
    config.pool.createTimeoutMillis = 30000; // 30 seconds
    // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
    // and not be checked out before it is automatically closed.
    config.pool.idleTimeoutMillis = 600000; // 10 minutes
    // [END cloud_sql_postgres_knex_timeout]
  
    // [START cloud_sql_postgres_knex_backoff]
    // 'knex' uses a built-in retry strategy which does not implement backoff.
    // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
    config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
    // [END cloud_sql_postgres_knex_backoff]
  
    if (process.env.DB_HOST) {
      //if (process.env.DB_ROOT_CERT) {
        //return createTcpPoolSslCerts(config);
      //} else {
        return createTcpPool(config);
      //}
    //} else {
      //return createUnixSocketPool(config);
    }
  };

const createTcpPool = async config => {
    // Extract host and port from socket address
    const dbSocketAddr = process.env.DB_HOST.split(':'); // e.g. '127.0.0.1:5432'

    // Establish a connection to the database
    return Knex({
        client: 'pg',
        connection: {
        user: process.env.DB_USER, 
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: dbSocketAddr[0],
        port: dbSocketAddr[1],
        }
    });
};

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type AstroObject {
        id: ID
        objectid: String
        RAdeg: Float
        DECdeg: Float
        umag: Float
        gmag: Float
        rmag: Float
        imag: Float
        g_r: Float
        flag: String
    }

    type Query {
        astroObjects(objectid: ID): AstroObject
    }
`;

const getAstroObject = async id => {
    let res = await pool("astro_objects").where("objectid", id);
    return res;
}


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    async astroObjects(parent, args, context, info) {
        // Ensure that there is a connection to the DB
        pool = pool || (await createPoolAndEnsureSchema()); // blah
        console.log("TEST");
        // Validate that the request contains an ID to be used in the lookup query  
        if(args && args.objectid) {
            let res = await getAstroObject(parseFloat(args.objectid));
            return res[0];
        } else {
            writeLog("The required arguments were not passed to the astro-object-api schema!", "ERROR")
        }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function writeLog(text, sev) {
    // Writes the log entry
    await log.write(log.entry({ resource: { type: "global" }, severity: sev }, text));
}

exports.handler = server.createHandler();
