const express = require("express");
const router = express.Router();
const db = require("../models");
require("dotenv").config();
const res = require("express/lib/response");

router.get("/:id", async (req, res) => {
  console.log("GET VOTES:id");
  const user = res.locals.user;
  const imgid = req.params.id;
  console.log("ID:", imgid);

  if (req.cookies.userId) {
    try {
      const picInfo = await db.catpic.findOne({
        where: {
          id: imgid,
        },
      });
      console.log("PIC INFO", picInfo);

      // get all catptions
      const allCaptions = await db.caption.findAll({
        where: { catpicId: imgid },
        raw: true,
      });
      
console.log('ALLCAPTS LENGTH', allCaptions.length)
      //get all captions with votes and add voteline
      let captionsWithVotes = await Promise.all(
        allCaptions.map(async (cap) => {
          const votes = await db.vote.count({
            where: { captionId: cap.id },
          });
          const userVotes = await db.vote.count({
            where: { captionId: cap.id, userId: user.id}, 
          });
          cap.canVote = userVotes === 0
          cap.votes = votes;
          return cap;
        })
      );
      console.log("ALLCAPTSWITHSVOTES", captionsWithVotes);

      // //sort by highest vote count
      // console.log("CAPPS WITH VOTES:", captionsWithVotes);
      // // console.log("CAPPS WITH VOTES:", sortedCaps)
      // console.log("USERID:", user.id);

      // //get all indexes of captionswithvotes
      // let captionsWithVotesIndexes = [];
      // captionsWithVotes.forEach((cap) => {
      //   captionsWithVotesIndexes.push(cap.id);
      // });
      // console.log("CAPS WITH VOTES IDX", captionsWithVotesIndexes);

      // function uniqueIdx(arr) {
      //   return [...new Set(arr)];
      // }

      // //get the captions that are unique using
      // let allUniqCaptionsWithVotes = [];
      // let uniqIdx = uniqueIdx(captionsWithVotesIndexes);
      // console.log("unigIdx:", uniqIdx);
      // captionsWithVotes.forEach((cap, i) => {
      //   if (uniqIdx[i] === cap.id) {
      //     allUniqCaptionsWithVotes.push(cap);
      //   }
      // });


      if (!captionsWithVotes) {
        res.redirect("/captions/prompt");
      } else {
        res.render("captions/votes.ejs", {
          catid: picInfo,
          captions: captionsWithVotes,
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("users/login");
  }
});

//get all vote count
//vote happens when there is a captionid and a user id
router.post("/:id", async (req, res) => {
  console.log("POST /results/:id/vote");
  console.log("BODY", req.body);
  console.log("PARAMS", req.params);
  console.log("catid:", req.body.imageid);
  user = res.locals.user;
  catid = req.body.imageid;
  captionid = req.params.id;

  if (req.cookies.userId) {
    try {
      await db.vote.create({
        userId: user.id,
        captionId: captionid,
      });

      res.redirect(`/votes/${catid}`);
      // res.render("captions/votes.ejs", { catid: catid, captions:captions });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/users/login");
  }
});

module.exports = router;
