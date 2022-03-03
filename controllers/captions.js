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

router.get("/prompt", async (req, res) => {
  const catpics = await db.catpic.findAll({ raw: true });
  res.render("captions/prompt.ejs", { catpic: catpics[0] });
});

router.post("/prompt", async (req, res) => {
  console.log("/PROMPT");
  const catid = req.body.catpicid;
  //id of image
  const caption = req.body.caption;
  const user = res.locals.user;
  const newCaption = await db.caption.create({
    userId: user.id,
    catpicId: catid,
    text: caption,
  });
  res.redirect("/captions/results");
});

router.get("/results", async (req, res) => {
  const user = res.locals.user;
  const userId = user.id;
  //find user's last caption entry and get captionId
  const getCaptionId = await db.caption.findOne({
    where: { userId },
    order: [["updatedAt", "DESC"]],
    raw: true,
  });
  // console.log(getCaptionId)
  const catPicId = getCaptionId.catpicId;

  // console.log(catPicId)
  //get cat picture
  const getCatPic = await db.catpic.findOne({
    where: { id: catPicId },
    raw: true,
  });

  // get all catptions
  const allCaptions = await db.caption.findAll({
    where: { catpicId: catPicId },
    raw: true,
  });

  //get all vote count
  //vote happens when there is a captionid and a user id

  //get 1 vote

  const captionsid = allCaptions.id
/* This is counting the number of votes for each caption. */
console.log(captionsid)

router.post("/results", (req, res) => {
  let captionid = req.body.captionid
  console.log(`CATID: ${captionid}`)
})


  // const votes = await db.vote.count({ 
  //   where:{ captionId: allCaptions.id }
  // })
  // // console.log(votes)
  // // console.log(allCaptions);
  res.render("captions/results.ejs", {
    catid: getCatPic,
    captions: allCaptions,
  });
});

module.exports = router;

