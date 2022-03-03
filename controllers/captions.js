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

router.post("/prompt", async (req, res) => {
  console.log("/PROMPT");
  const catid = req.body.catpicid;
  //id of image
  const caption = req.body.caption;
  // const user =
  const user = res.locals.user;
  const newCaption = await db.caption.create({
    userId: user.id,
    catpicId: catid,
    text: caption,
  });
  res.redirect("captions/results");
});

module.exports = router;



// router.get('/results', (req, res) => {

// })
//get the image
// const captionImage = await db.catpic.findOne({
//   where: { id: catid },
// });
//get all captions
// const allCaptions = await db.caption.findAll({
//   where: { catpicId: catid },
//   raw: true,
// });
// console.log(allCaptions);
// res.render("captions/results.ejs", {
//   catimage: captionImage,
//   captions: allCaptions,
// });
// console.log()
//
//getroute
//createvote

// router.get("/results", (req, res) => {
//   res.render("captions/results.ejs");
// });

// router.get("/results", async (req, res) => {
// const catid = req.body.catpicid;
//render image
//render all captions
// const captionResults = await db.
//show count
// });

// module.exports = router;
