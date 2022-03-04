const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");
const res = require("express/lib/response");
const { user } = require("pg/lib/defaults");
require("dotenv").config();

router.get("/", (req, res) => {
  res.render("home.ejs");
});
//user signup page

router.get("/login", (req, res) => {
  res.render("users/login.ejs", { error: null });
});

//get info to create account
router.post("/", async (req, res) => {
  const [newUser, created] = await db.user.findOrCreate({
    //findourcreate will always
    where: { email: req.body.email },
  });
  if (!created) {
    console.log("user already exists");
    //render the login page and send an appropriate message
    //render says to send
    //redirect is go ping another req route
    res.render("users/new.ejs", {
      error: "user already exists, try logging in :)",
    });
  } else {
    //hash the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.password = hashedPassword;

    await newUser.save();

    //encrypt the user id via advanced encrption standard AES
    //encrypt takes in 2 variables.
    const encryptedUserId = cryptojs.AES.encrypt(
      newUser.id.toString(),
      process.env.SECRET
    );
    const encryptedUserIdString = encryptedUserId.toString();
    //store the encrypted id in the cookie of the res obj
    res.cookie("userId", encryptedUserIdString);
    //redirect back to home page
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("users/new.ejs");
});
router.post("/login", async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.body.email } });
  if (!user) {
    //user not found in database
    console.log("user not found!");
    //passing through error message
    res.render("users/login.ejs", { error: "Invalid email/password" });
  } else if (!bcrypt.compareSync(req.body.password, user.password)) {
    //found user but pw was wrong
    console.log("incorrect password");
    //compares plain pw to hashed pw
    res.render("users/login.ejs", { error: "Invalid email/password" });
  } else {
    console.log("logging in the user!");
    const encryptedUserId = cryptojs.AES.encrypt(
      user.id.toString(),
      process.env.SECRET
    );
    const encryptedUserIdString = encryptedUserId.toString();
    //store the encrypted id in the cookie of the res obj
    res.cookie("userId", encryptedUserIdString);
    //redirect back to home page
    res.redirect("/");
  }
});

//create username
router.post("./newusername", async (req, res) => {
  const username = await db.user.findOne({
    where: { username: req.body.username },
  });
});

router.get("/kittytree", async (req, res) => {
  // const id = req.params.id
  const user = res.locals.user;
  console.log(user.id);
  // const captions = await res.locals.user.getCaptions();
  const captions = await db.caption.findAll({
    where: {
      userId: user.id,
    },
    include: [db.catpic],
    // include:[db.vote],
    raw: true,
  });

  // const catpic = await db.catpic.findOne({
  //   where: { id: catpicId },
  // });
console.log(captions)
  res.render("users/profile.ejs", { captions: captions });
});

//show based on exercise clicked on
router.get("/kittytree/:id", async (req, res) => {
  let picId = req.params.id;
  const catpic = await db.catpic.findByPk(picId);
  const userCaption = await res.locals.user.getCaptions()
 
  res.render("users/edit.ejs", { id: picId, catpic: catpic, usercap: userCaption});
});

router.put('/kittytree/:id', (req, res) => {
  let picId = req.params.id 
})

router.get("/newusername", (req, res) => {
  res.render("users/username.ejs");
});
// user:res.local.user

//clears cookies
router.get("/logout", (req, res) => {
  console.log("logging out");
  res.clearCookie("userId");
  res.redirect("/");
});
//export all these routes to the entry point file

module.exports = router;
