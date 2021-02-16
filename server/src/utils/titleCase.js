/**
 * this function takes in a string and returns
 * a title case version of the same string.
 * 
 * it capitalized the next letter following a special
 * character. E.g "he is a boy. she is a GIRL" returns
 * "He Is a Boy. She Is a Girl" and "he is a boy/she is a GIRL"
 * returns 'He Is a Boy/She Is a Girl'
 * 
 * @param {string} s 
 */

function toTitleCase(s) {
  var str = s.toString().toLowerCase()
  var regx = /(\b[a-z](?!\s))/g;
  return str.replace(regx, function(_) { return _.toUpperCase(); });
}

module.exports = toTitleCase;
