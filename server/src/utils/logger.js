var util = require('util');
var path = require('path');
var fileSystem = require('fs');
var root = require('app-root-path');


var logger = {};

function isDir(filePath) {
  var dirname = path.dirname(filePath);
  if (fileSystem.existsSync(dirname)) return true;
  isDir(dirname);
  fileSystem.mkdirSync(dirname);
};

isDir(`${root}/logs/info.log`);
isDir(`${root}/logs/error.log`);

var infoStream = fileSystem.createWriteStream(`${root}/logs/info.log`, { flags: 'a' });
var errorStream = fileSystem.createWriteStream(`${root}/logs/error.log`, { flags: 'a' });

fileSystem.readdir(`${root}/logs/`, function(error, items) {
  if (error) throw error;
  items.forEach(function(file) {
    var fileSizeInBytes = fileSystem.statSync(`${root}/logs/${file}`).size;
    // Check if file size is greater than a certain amount (1mb)
    if (fileSizeInBytes > 1048576) {
      // truncate file content
      fileSystem.writeFile(`${root}/logs/${file}`, '', function() { return null });
    }
  });
});


logger.info = function(info) {
  var message = `[${new Date()}] : ${util.inspect(info)}\n`;
  infoStream.write(message);
};

logger.error = function(error) {
  var message = `[${new Date()}] : ${util.inspect(error)}\n`;
  errorStream.write(message);
};

module.exports = logger;
