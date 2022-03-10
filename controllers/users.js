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

router.get("/login", (req, res) => {
  res.render("users/login.ejs", { error: null });
});

//create username
router.post("./newusername", async (req, res) => {
  if (req.cookies.userId){
    try {
      const username = await db.user.findOne({
        where: { username: req.body.username },
      });
    } catch(err) {
      console.log("err", err)
    }
  } else {
    res.redirect("/users/login");
  }
});


//profilepage
router.get("/kittytree", async (req, res) => {
  console.log("GET /KITTYTREE");
  const user = res.locals.user;
  if (req.cookies.userId) {
    const captions = await db.caption.findAll({
      where: {
        userId: user.id,
      },
      include: [db.catpic],
      // include:[db.vote],
      raw: true,
    });
    console.log(captions)
    res.render("users/profile.ejs", { captions: captions });
  } else {
    res.redirect("/users/login")
  }
});
//edit form
router.put("/kittytree/:id/edit", async (req, res) => {
  console.log("PUTTTSS: /kittytree/:id");
  console.log("PARAMS:", req.params);
  let capid = req.params.id;
  
  try {
    const foundCaption = await db.caption.findOne({
      where: {
        id: capid,
      },
    });
    console.log("foundCaption BEFORE:", foundCaption);
    foundCaption.update({
      text: req.body.caption,
    });
    await foundCaption.save();
    console.log("foundCaption AFTER:", foundCaption);
    res.redirect(`/users/kittytree` );
  } catch(err) {
    console.log("err", err)
  }
});
//show based on caption clicked
router.get("/kittytree/:id/edit", async (req, res) => {
  console.log("GET /KITTYTREE/:ID");
  let capid = req.params.id;
  try {
    const caption = await db.caption.findOne({ 
      where: {
        id: capid,
      },
      include: [db.catpic],
      raw: true,
    })
    res.render(`users/edit`, { capid: capid, caption: caption});
  } catch(err) {
    console.log(err)
  }
});

router.delete("/kittytree/:id/edit", async (req, res) => {
  console.log("DELETE kitty/:id")
  if (req.cookies.userId) {
    try {
      const foundCaption = await db.caption.findOne({ 
        where: { id: req.params.id } 
      })
      console.log("found caption",foundCaption)
      await foundCaption.destroy()
      res.redirect('/users/kittytree')
    } catch (err) {
    console.log(err)
    } 
  } else { 
    res.redirect("users/login")
  }
})

router.get("/newusername", (req, res) => {
  res.render("users/username.ejs");
});


//clears cookies
router.get("/logout", (req, res) => {
  console.log("logging out");
  res.clearCookie("userId");
  res.redirect("/");
});
//export all these routes to the entry point file

module.exports = router;
