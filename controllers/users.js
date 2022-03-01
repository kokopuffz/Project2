const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
const res = require('express/lib/response')
const { user } = require('pg/lib/defaults')
require('dotenv').config()


router.get('/new', (req,res)=> {
  res.render('users/new.ejs')
})

router.post('/', async (req,res)=>{
  //TESTing
  // const whatisthis = await db.user.findOrCreate({
  //   where:{email: req.body.email}
  // })
  // console.log(whatisthis)
  const [newUser, created] = await db.user.findOrCreate({
    //findourcreate will always return array with 2 values..one is the main thing and 2nd a trueorfalse at created.
    where:{email: req.body.email}
  })
  if(!created){
    console.log('user already exists')
    //render the login page and send an appropriate message
    //render says to send 
    //redirect is go ping another req route
    
  }else{
    //hash the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    newUser.password =hashedPassword
    
    await newUser.save()

    //encrypt the user id via advanced encrption standard AES
    //encrypt takes in 2 variables.
    const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
    const encryptedUserIdString = encryptedUserId.toString()
    console.log(encryptedUserIdString)
    //store the encrypted id in the cookie of the res obj
    res.cookie('userId', encryptedUserIdString)
    //redirect back to home page
    res.render('users/kittyhome.ejs')
  }

})



router.get('/login',(req, res)=>{
  res.render('users/login.ejs',{error:null})
})


router.post('/login', async (req,res)=>{
  const user = await db.user.findOne({where: {email:req.body.email}})
  if(!user){ //user not found in database
    console.log('user not found!')
    //passing through error message
    res.render('users/login.ejs', { error: 'Invalid email/password' })
  }else if(!bcrypt.compareSync(req.body.password, user.password)){ 
    //found user but pw was wrong
    console.log('incorrect password')
    //compares plain pw to hashed pw
    res.render('users/login.ejs', { error: 'Invalid email/password' })
  }  else {
    console.log('logging in the user!')
    const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET);
    const encryptedUserIdString = encryptedUserId.toString();
    console.log(encryptedUserIdString);
    //store the encrypted id in the cookie of the res obj
    res.cookie("userId", encryptedUserIdString);
    //redirect back to home page
    res.render("users/kittyhome.ejs");
  }
})

//create username
router.post('./newusername', async (req, res)=>{
const username = await db.user.findOne({where: {username:req.body.username}})
  if (!username) { 
    // let user = 
  }
})

// user:res.local.user



//clears cookies
router.get('/logout',(req, res)=>{
  console.log('logging out')
  res.clearCookie('userId')
  res.redirect('/')
})
//export all these routes to the entry point file

router.get("/kittyhome", (req, res) => {
  res.render("users/kittyhome.ejs");
});
router.get("/kittytree", (req, res) => {
  res.render("users/profile.ejs");
});

router.get('/newusername',(req,res)=>{
  res.render("users/username.ejs")
})

module.exports = router