const client = require('../client/elasticsearch')
const logger = require('./logger')

async function esIndex(data, index) {
  if (!await client.indices.exists({ index })) {
    await client.indices.create({ index })
  }

  // get data ready for bulk upload
  const body = []
  data.forEach(function(doc) {
    console.log(doc["Order Id"], ">>>>");
    body.push({
      index: {
        _id: doc["Order Id"],
        _index: index,
      }
    })
    body.push(doc);
  })

  const { items: response } = await client.bulk({ refresh: true, body })
  if (response && response.errors) {
    const erroredDocuments = []
    response.items.forEach(function(action, i) {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })

    // log the errored document
    logger.error(erroredDocuments)
  }
  const count = await client.count({ index })

  // log the successful document count
  console.log(count, ["%c"])
  logger.info(count);
}

module.exports = esIndex
