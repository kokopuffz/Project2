const express = require("express");
const router = express.Router();
const db = require("../models");
require("dotenv").config();
const res = require("express/lib/response");



// axios(catConfig).then(function (response) {
//   console.log(JSON.stringify(response.data));
// });

router.get("/", (req, res) => {
  res.render("captions/index.ejs");
});

// router.post('/')


router.get("/prompt", async (req, res) => {
  const catpics = await db.catpic.findAll({ raw: true });
  res.render("captions/prompt.ejs", { catpic: catpics[0] });
});

router.post('/prompt', async (req, res) => {
  console.log('/PROMPT')
  const catid = req.body.catpicid
  //id of image
  const caption = req.body.caption
  // const user = 
  const user = res.locals.user
  const newCaption = await db.caption.create({
    userId: user.id,
    catpicId: catid,
    text: caption
  })
  res.redirect("captions/results")
})

module.exports = router;
