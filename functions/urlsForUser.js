const urlsForUser = function(obj, id) {
  let results = {};
  for (const shortURL in obj) {
    if (obj[shortURL].userID === id) {
      results[shortURL] = obj[shortURL].longURL;
    }
  }
  return results;
};

module.exports = { urlsForUser };