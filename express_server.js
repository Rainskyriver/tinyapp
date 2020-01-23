const express = require('express');
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
const { generateRandomString, checkEmail, urlsForUser, isLoggedIn } = require('./helpers.js');

//Default URLs
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "randomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "randomID" }
};

//Default Users
const users = {
  "randomID": {
    id: "randomID",
    email: "example@example.com",
    password: "$2b$10$8ue37eeHFtRZDtXcwwiJJu0/Jj6DFDJoBtmKQz9sDHv26VBZOv8te"
  },
  "randomID2": {
    id: "randomID2",
    email: "example@exampleish.com",
    password: "exampleish123"
  }
};


app.set("view engine", "ejs");

// app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieSession({
      name: 'session',
      keys: ["key1"]
    }));

//========GET================================================================
//Standard
app.get("/", (req, res) => {
  res.send('Hello');
});

//for urls_index in ./views
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

//for urls_new in ./views
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id]
  };
  if (users[req.session.user_id]) {
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

//for urls_show in ./views
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

//view urls_register
app.get("/register", (req, res) => {
  res.render("urls_register");
});

//view urls_login
app.get("/login", (req, res) => {
  res.render("urls_login");
});

//newURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//catchAll
app.get("*", (req, res) => {
  res.redirect("/urls");
});


// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>");
// });
//============POST==============================================


//Edit URL button
app.post("/urls/:id", (req, res) => {
  if (isLoggedIn(urlDatabase, req.session)) {
    const longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.sendStatus(401);
  }
});

//Post new URL
app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = {
    longURL: long,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${short}`);
});

//Register new user
app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '' || checkEmail(users, req.body.email)) {
    res.sendStatus(403);
  }
  hashword = bcrypt.hashSync(req.body.password, 10);
  id = generateRandomString();
  users[id] = { 
    id,
    email: req.body.email,
    password: hashword
  };

  req.session.user_id = id;
  res.redirect("/urls");
});

//login
app.post("/login", (req, res) => {
  if (checkEmail(users, req.body.email)) {
    
    for (let user in users) {
      if ((bcrypt.compareSync(req.body.password, users[user].password)) && (req.body.email === users[user].email)) {
        req.session.user_id = users[user].id;
        res.redirect("/urls");
      }
    }
  }
    res.redirect("/login");
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/urls");
});

//==========DELETE==============================================
//delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (isLoggedIn(urlDatabase, req.session.user_id)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.sendStatus(401);
  }
});

//============LISTEN============================================
app.listen(PORT, () => {
  console.log(`Example listening on port: ${PORT}`);
});
