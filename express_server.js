const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
const { generateRandomString } = require('./functions/generateRandomString.js');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
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
    username: req.cookies.username || "Not logged in"
  };
  res.render("urls_index", templateVars);
});

//for urls_new in ./views
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username || "Not logged in"
  };
  res.render("urls_new", templateVars);
});

//for urls_show in ./views
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username || "Not logged in"
  };
  res.render("urls_show", templateVars);
});

//
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>");
// });
//============POST==============================================


//Post new URL
app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = long;
  let templateVars = {
    shortURL: short,
    longURL: long, 
    username: req.cookies.username || "Not logged in"
  };
  res.render("urls_show", templateVars);
});

//Edit URL
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

//login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username || "Not logged in"
  }
  res.render("urls_index", templateVars);
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  let templateVars = {
    urls: urlDatabase,
  }
  res.render("urls_index", templateVars);
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
