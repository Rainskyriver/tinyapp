const checkEmail = function(obj, email) {
  for (const user in obj) {
    if (obj[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = { checkEmail };