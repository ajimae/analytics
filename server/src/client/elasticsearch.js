const { config } = require('dotenv')

config()

// elasticsearch client with credentials
// const elasticsearch = require('elasticsearch');

// const host = process.env.ELASTIC_CLIENT_HOST;
// const port = process.env.ELASTIC_CLIENT_PORT;

// const username = process.env.ELASTIC_CLIENT_USERNAME;
// const password = process.env.ELASTIC_CLIENT_PASSWORD;

// const client = new elasticsearch.Client({ hosts: [`http://${username}:${password}@${host}:${port}`] })

// elasticsearch client without credentials
const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({ hosts: ["http://localhost:9200"] });

module.exports = client
