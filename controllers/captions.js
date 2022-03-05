const express = require("express");
const router = express.Router();
const db = require("../models");
require("dotenv").config();
const res = require("express/lib/response");

router.get("/", (req, res) => {
  res.render("captions/index.ejs");
});

router.get("/prompt", async (req, res) => {
  const user = res.locals.user;
  const doneCaptions = await db.caption.findAll({
    where: { userId: user.id },
    order: [["catpicId", "desc"]],
    include: [db.catpic],
    raw: true,
  });

  const catpics = await db.catpic.findAll({
    order: [["id", "desc"]],
    raw: true,
  });

  //array for all catimgids and user's completedimgids
  let doneCaptsArr = [];
  let allPicsArr = [];
  doneCaptions.forEach((cap) => {
    doneCaptsArr.push(cap.catpicId);
  });
  catpics.forEach((pic) => {
    allPicsArr.push(pic.id);
  });

  //compare and get new array with the incompleted imgids
  let notDoneCapts = allPicsArr.filter(
    (imgid) => !doneCaptsArr.includes(imgid)
  );

  let idFirstImg = notDoneCapts[0];
  let picid;
  //grab entire id object
  for (let i = 0; i < catpics.length; i++) {
    if (idFirstImg === catpics[i].id) {
      picid = catpics[i];
    }
  }
  console.log("FINAL ANSWER", picid);
  console.log(notDoneCapts);
  console.log(idFirstImg);
  res.render("captions/prompt.ejs", {
    notdone: notDoneCapts,
    picid: picid,
    firstImg: idFirstImg,
  });
});

router.post("/prompt/", async (req, res) => {
  const catpicid = req.body.catpicid;
  //id of image
  const caption = req.body.caption;
  const user = res.locals.user;

  await db.caption.create({
    userId: user.id,
    catpicId: catpicid,
    text: caption,
  });

  res.redirect(`/captions/results/${catpicid}`);
});

router.get("/results/:id", async (req, res) => {
  const user = res.locals.user;
  const id = req.params.id;
  const picInfo = await db.catpic.findOne({id});
  console.log(picInfo);

  // get all catptions
  const allCaptions = await db.caption.findAll({
    where: { catpicId: id },
    include: [db.vote],
    raw: true,
  });
console.log(allCaptions)
  
  // const captionsid = allCaptions.id
  /* This is counting the number of votes for each caption. */
  // const votes = await db.vote.count({
  //   where:{ captionId: allCaptions.id }
  // })
  res.render("captions/results.ejs", {
    catid: picInfo,
    captions: allCaptions,
  });
});

//get all vote count
//vote happens when there is a captionid and a user id
router.post("/results", (req, res) => {
  // let captionid = req.body.captionid;
  // let captionvalue = captionid.value
  //so for votes i need, the current usersid,captionid
  console.log(user);
  // const getUserVote = await.db
});

module.exports = router;
