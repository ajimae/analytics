/**
 * This file converts a json file
 * to a csv file.
 */

const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const file = path.join(__dirname, "..", "data", "cities.csv")

let data = []
function capitalize(s) {
  var str = s.toString().toLowerCase()
  var regx = /(\b[a-z](?!\s))/g;
  return str.replace(regx, function(_) { return _.toUpperCase(); });
}

fs.createReadStream(file)
  .on('error', function(error) {
    console.error(error)
  })
  .pipe(csv())
  .on('data', function(row) {
    const line = {}
    for (let i = 0; i < Object.keys(row).length; i++) {
      line[capitalize(Object.keys(row)[i])] = capitalize(row[Object.keys(row)[i]])
    }

    data.push(line)
  }).on('end', function() {

    // write to csv here
    writeToFile(data)
  })

function writeToFile(data) {
  const file = path.join(__dirname, "..", "elk-stack", "logstash", "cities.csv")
  const writeStream = fs.createWriteStream(file)
  const header = ['Country', 'State', 'Lg', 'City', 'Postcode', 'Allstates_id']

  writeStream.write(header.join(', ') + '\n')
  data.forEach(function(v) {
    let line = []

    line.push(v['Country'].toString().trim())
    line.push(v['State'].toString().trim())
    line.push(v['Lg'].toString().trim())
    line.push(v['City'].toString().trim())
    line.push(v['Postcode'].toString().trim())
    line.push(v['Allstates_id'].toString().trim())

    writeStream.write(line.join(', ') + '\n', function() {
      // a line was successfully written to file
    });
  });

  writeStream.end()
  writeStream.on('finish', function() { console.log('finished writing file') })
  writeStream.on('error', function(error) { console.error(error.message) })
}
