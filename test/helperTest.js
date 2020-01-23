const { assert } = require('chai');

const { generateRandomString, checkEmail, urlsForUser, isLoggedIn } = require('../helpers.js');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkEmail', function() {
  it('should return a user with valid email', () => {
    const user = checkEmail(users, "user@example.com")
    const expectedOutput = "userRandomID";

    assert(user, expectedOutput);
  });
  it('should return null or undefined when given an invalid email', ()=>{
    const user = checkEmail(users, "u@u.ca")
    const expectedOutput = undefined;

    assert.isUndefined(user, expectedOutput);
  });
});
