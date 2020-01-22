const urlsForUser = function(id) {
  let results = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      results[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return results;
};

module.exports = { urlsForUser };