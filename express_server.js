const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
const { generateRandomString } = require('./functions/generateRandomString.js');
const { checkEmail } = require('./functions/checkEmail.js');
const { urlsForUser } = require('./functions/urlsForUser.js');
const { isLoggedIn } = require('./functions/isLoggedIn.js');

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
    password: "123"
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
    urls: urlsForUser(urlDatabase, req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

//for urls_new in ./views
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlsForUser(urlDatabase, req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  if (users[req.cookies.user_id]) {
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

//for urls_show in ./views
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies.user_id]
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
  if (isLoggedIn(urlDatabase, req.cookies)) {
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
    userID: req.cookies.user_id
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

  res.cookie("user_id", id);
  res.redirect("/urls");
});

//login
app.post("/login", (req, res) => {
  if (checkEmail(users, req.body.email)) {
    
    for (let user in users) {
      if ((bcrypt.compareSync(req.body.password)) && (req.body.email === users[user].email)) {
        console.log(users[user].id);
        res.cookie("user_id", users[user].id);
        res.redirect("/urls");
      }
    }
  }
    res.redirect("/login");
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");

  res.redirect("/urls");
});

//==========DELETE==============================================
//delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (isLoggedIn(urlDatabase, req.cookies)) {
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
