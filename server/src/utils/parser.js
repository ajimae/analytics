/**
 * this function takes in a csv file
 * process each entry into a title case
 * formatted string and passes the resulting
 * data for indexing.
 */

const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const toTitleCase = require('./titleCase')
const esIndex = require('./esIndex')


function write(data) {
  // console.log(data);
  const writeStream = fs.createWriteStream(data);

  writeStream.write(JSON.stringify(data));

  writeStream.end();
  writeStream.on("error", function(error) { console.error(error.message) });
  writeStream.on('finish', function() { console.log('finished writing file') });
}

function parse({ file, index }) {
  const data = [];
  fs.createReadStream(file)
    .on('error', function(error) {
      console.trace(error)
    })
    .pipe(csv())
    .on('data', function(row) {
      const line = {};
      for (let i = 0; i < Object.keys(row).length; i++) {
        line[toTitleCase(Object.keys(row)[i]).trim()] = toTitleCase(row[Object.keys(row)[i]]).trim()
      }

      data.push(line)
    }).on('end', function() {
      // make es bulk upload here
      esIndex(data, index).catch(console.error);
      // write(data);
    })
}

module.exports = { parse }
