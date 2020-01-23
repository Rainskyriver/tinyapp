const isLoggedIn = function(obj, cookie) {
  for (const user in obj) {
    if (obj[user].userID === cookie["user_id"]) {
      return true;
    }
  }
  return false;
};

module.exports = { isLoggedIn };