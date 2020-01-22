const checkEmail = function(obj, email) {
  for (const user in obj) {
    if (obj[user].email === email) {
      console.log(obj[user].email);
      console.log(email);
      return true;
    }
  }
  return false;
};

module.exports = { checkEmail };