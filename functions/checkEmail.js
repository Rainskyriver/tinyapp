const checkEmail = function(obj, email) {
  for (const user in obj) {
    if (obj[user].email === email) {
      return obj[user];
    }
  }
  return undefined;
};

module.exports = { checkEmail };