const generateRandomString = function() {
  const randomNum = function() {
    return (Math.floor(Math.random(122) * 100));
  };
  let results = "";
  while (results.length < 6) {
    randomInt = randomNum();
    if ((randomInt >= 97 && randomInt <= 122) || randomInt >= 65 && randomInt <= 90) {
      results += (String.fromCharCode(randomInt));
    } else if (randomInt < 10) {
      results += randomInt;
    }
  }
  return results;
}

module.exports = { generateRandomString };