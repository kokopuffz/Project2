const express = require("express"); // import express
const app = express(); // create an express instance
const ejsLayouts = require("express-ejs-layouts"); // import ejs layouts
require("dotenv").config(); // allows us to access env vars
const cookieParser = require("cookie-parser");
const cryptoJS = require("crypto-js");
const db = require("./models/index.js");
const axios = require("axios");
const catUrl = `https://thecatapi.com/v1/images/search?api_key=${process.env.CAT_API_KEY}`;
const catConfig = {
  method: "get",
  url: "https://api.thecatapi.com/v1/images/search?mime_types=jpg,png&includehas_breeds=1&includeformat=json",
  // url: "https://api.thecatapi.com/v1/categories",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${process.env.CAT_API_KEY}`,
  },
};

// MIDDLEWARE
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(cookieParser()); //gives us access to req.cookies
app.use(ejsLayouts); // tell express we want to use layouts
app.use(express.urlencoded({ extended: false })); //bodyparser to make our req.body work

//CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next) => {
  if (req.cookies.userId) {
    //decrypting the incoming user id from the cookie
    const decryptedId = cryptoJS.AES.decrypt(
      req.cookies.userId,
      process.env.SECRET
    );
    //converting the decrypted id into a readable string
    const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8);
    //quering the db for the user with t hat id
    const user = await db.user.findByPk(decryptedIdString);
    //assigning the found user to res.locals.user in the routes, and user in the eks
    res.locals.user = user;
  } else res.locals.user = null;
  next();
});

// CONTROLLERS
app.use("/users", require("./controllers/users.js"));
app.use("/captions", require("./controllers/captions.js"));

// ROUTES
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("*", (req, res) => {
  res.render("404");
});

// check for an env PORT, otherwise use 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Auth app running on ${PORT}`);
});
