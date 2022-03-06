const express = require("express");
const router = express.Router();
const db = require("../models");
require("dotenv").config();
const res = require("express/lib/response");

router.get("/instructions", (req, res) => {
  res.render("captions/instructions.ejs");
});

//start of game, gets catpic and caption tables to determine which prompt is avail to them
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
  // console.log("NOT DONE CAPTS", notDoneCapts)
  // console.log("DIS PIC ID" ,idFirstImg)
  // console.log("THIS DA IMG",picid)
  res.render(`captions/prompt.ejs`, {
    notdone: notDoneCapts,
    picid: picid,
    firstImg: idFirstImg,
  });
});

router.post("/prompt/", async (req, res) => {
  const catpicid = req.body.catpicid;
  console.log("POST CATPICID", catpicid)
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
  console.log("GET RESULTS:id");
  const user = res.locals.user;
  const imgid = req.params.id;
  console.log("ID:", imgid)
  const picInfo = await db.catpic.findOne({
    where: { 
      id: imgid
    }
  });
  console.log("PIC INFO", picInfo);

  // get all catptions
  const allCaptions = await db.caption.findAll({
    where: { catpicId: imgid },
    include: [db.vote],
    raw: true,
  });
  console.log("ALLCAPTS", allCaptions);

  let captionsWithVotes = await Promise.all(allCaptions.map( async cap => {
    const votes = await db.vote.count({
      where: { captionId: cap.id },
    });
    cap.votes = votes
    return cap
  }))
  console.log("CAPTIONS WITH VOTES", captionsWithVotes)
  console.log("USERID:", user.id)

  if(!captionsWithVotes){
    res.redirect("/captions/prompt")
  } else {
    res.render("captions/results", {
      catid: picInfo,
      captions: captionsWithVotes,
    });
  }

});

//get all vote count
//vote happens when there is a captionid and a user id
router.post("/results/:id/vote", async (req, res) => {
  console.log("POST /results/:id/vote");
  console.log("BODY", req.body)
  console.log("PARAMS", req.params)
  console.log("imageid:", req.body.imageid)
  user = res.locals.user
  imageid = req.body.imageid
  captionid = req.params.id

  await db.vote.create({
    userId: user.id,
    captionId: captionid,
  })


  res.redirect(`/captions/results/${imageid}`)
});

module.exports = router;
