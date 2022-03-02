const express = require("express");
const router = express.Router();
const db = require("../models");
require("dotenv").config();

axios(catConfig).then(function (response) {
  console.log(JSON.stringify(response.data));
});




module.exports.router;
