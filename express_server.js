const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
const { generateRandomString } = require('./functions/generateRandomString.js');

//Default URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Default Users
const users = {
  "randomID": {
    id: "randomID",
    email: "example@example.com",
    password: "example123"
  },
  "randomID2": {
    id: "randomID2",
    email: "example@exampleish.com",
    password: "exampleish123"
  }
};


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//========GET================================================================
//Standard
app.get("/", (req, res) => {
  res.send('Hello');
});

//for urls_index in ./views
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render("urls_index", templateVars);
});

//for urls_new in ./views
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render("urls_new", templateVars);
});

//for urls_show in ./views
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});

//view urls_register
app.get("/register", (req, res) => {
  res.render("url_register")
});

//newURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(req.params.shortURL, urlDatabase[req.params.shortURL]);
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
  const longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;
  res.redirect('/urls');
});

//Post new URL
app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = long;
  res.redirect(`/urls/${short}`);
});

//Register new user
app.post("/register", (req, res) => {
  userID = generateRandomString();
  res.cookie("user_id", userID);
  console.log(req.cookies.user_id, userID)

  users[userID] = { 
    userID,
    email: req.body.email,
    password: req.body.password
  };

  res.redirect("/urls");
});

//login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);

  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");

  res.redirect("/urls");
});

//==========DELETE==============================================
//delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//============LISTEN============================================
app.listen(PORT, () => {
  console.log(`Example listening on port: ${PORT}`);
});
