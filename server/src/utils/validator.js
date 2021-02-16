const fileFilter = function(req, file, callback) {
  // Accept csv files only
  if (!file.originalname.match(/\.(csv)$/)) { // other file formats can be included in the future e.g (csv|json|txt)
    req.fileValidationError = 'only csv files are allowed!';
    return callback(Error('only csv files are allowed!'), false);
  }

  callback(null, true);
};

module.exports = fileFilter
