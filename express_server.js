const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const { generateRandomString } = require('./functions/generateRandomString.js');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//========GET================================================================
//Standard
app.get("/", (req, res) => {
  res.send('Hello');
});

//for urls_index in ./views
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//for urls_new in ./views
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//for urls_show in ./views
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

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

app.post("/urls", (req, res) => {
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = long;
  let templateVars = { shortURL: short, longURL: long };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//============LISTEN============================================
app.listen(PORT, () => {
  console.log(`Example listening on port: ${PORT}`);
});
