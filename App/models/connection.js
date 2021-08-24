const { MongoClient } = require('mongodb');

const MONGO_DB_URL = process.env.MongoDB || 'mongodb://127.0.0.1:27017';

let schema = null;
async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((conn) => conn.db('appmaster'))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = connection;
