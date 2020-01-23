const isValidShortURL = function(obj, shortURL) {
  for (const url in obj) {
    if (url === shortURL) {
      return url;
    }
  }
  return null;
};

module.exports = { isValidShortURL };