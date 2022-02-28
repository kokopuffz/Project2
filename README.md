# kitty-text


## project idea/description
What type of app would encourage people to once again, give up their personal email to try out?  I was suggested a cat rating app... like Rate-My-Chonk but it made me realize that I would be making another project that would exclude those who may be visually disabled or rely on assistive technology. This is my attempt to bridge that gap.  

It still involves ratings!  But instead of images, the user will be given prompts/[alt-texts] of cat images, and they will write a caption from just the prompt. Once entered, the actual image will show and users can vote on their favorite caption.  It's madlib sort of...with pictures... i don't know. :D

Users can continue to write captions or they can go "dev-mode" and write great alt-texts for other users.  This might be a stretch goal.

Hopefully, this will be entertaining to all participants including those using screen readers.

## User stories

- As a user, I want to vote my favorite captions.
- As a user, I want to vote my favorite alt-texts.
- As a user, I want to look at my previous captions.
- As a user, I want to add captions.
- As a user, I want to delete captions.
- As a user, I want to add alt-texts.
- As a user, I want to play devmode. 
- As a user, I want to edit my alt-texts.
- As a user, I want to delete my alt texts.
- As a user, I want to view my previous alt-texts.
- As a user, I want to view my previous captions.
## MVP
- use TheCatApi and write out 30-40 weak? alt-texts for images
- keep track of all images users interact with alt text and captions
- make sure user does not get the same prompt they have already captioned
- make sure user does not get the same prompt they have already provided alt-texts
- provide 2 modes for users (dev, captions)
- make sure images go to devmode
- make sure only alt-texts go to captions mode
- upvote options for both alt texts and captions
- make sure user cannot vote on something more than once
- delete/edit option for all alt texts and captions in their cattree page
- cats that were captioned on will become images in user's cattree

## stretch goals
- cats that were captioned on will become images in user's cattree, make them clickable
- random cat facts api on main page?
- dev affirmation api on "dev mode"
- about page
- if anything is edited, the vote count resets
## installation instructions

## link to deployed live site

## ERDS

![an ERD of my project](ERD.drawio.png)
## approach taken
## flow chart
![basic flow chart](flowchart.png)
## tech used
- nodeJS
- javascript
- express
- ejs-layouts
- bootstrap
- dotenv
- npm
- bcrypt 
- cryptoJS
- sequelize
- postgres
- postico 
- canva.com (wireframes)
- draw.io (ERD)
-TheCatApi


## wireframes
home page-basically, i want people to know what they are signing up for
![home page](index1.png)
home page-the image should carousel to show how it is played
![home page](index2.png)
user logged in index page
![logged-in page](cathome.png)
cat-tree page shows all collected cats of the user... cats the user has made captions for.
![cat-tree-page](cattree1.png)
cat-tree page includes all captions and alt-texts, has option to edit or delete
![logged-in page](cattree21.png)
captions mode instructions
![logged-in page](captionsinst.png)
captions prompt page
![logged-in page](caption2.png)
caption results page
![logged-in page](captionresult.png)
captions result page
![logged-in page](resultpage.png)
devmode instructions
![logged-in page](devmodeinst.png)
devmode gameplay
![logged-in page](devmode2.png)



## restful routing chart

| verb(REST) | url | action(CRUD) | description |
| ---------- | --- | ------------ | ----------- |
| GET |  / | index(read) | display index page |
| GET | /new | index(read) | display signup page |
| POST | /new | new(create) | create new user with the POST payload(form) data |
| GET | /login | show(read) | displays login page |
| POST | /login | login(create) | create session |
| GET | /kittyhome | show(read)) | display user's logged in main page |
| GET | / | users/logout(read) | clears cookies and renders index page |
| GET | /captions/ | show(read) | display captions start page |
| GET | /captions/start/ | show(read) | displays prompt |
| POST | /captions/prompt/:catid/ | new(create) | create new caption for the catid alt text |
| GET | /results/:catid/ | show(read) | display catid's results page |
| PUT | /results/:catid/ | update | update the number on any upvotes user makes|
| GET | /dev/ | show(read) | display devmode start page |
| GET | /dev/start/ | show(read) | displays prompt |
| POST | /dev/prompt/:catid/ | new(create) | create new alttext for the catid image |
| GET | /users/:userid/cattree | show(read) | display all of user's cats, captions, alt-texts |
| PUT | /users/:userid/cattree | edit(update) | update any caption or alt text from user's cattree page |
| DELETE | /users/:userid/cattree | destroy | delete any caption or alt text from user's cattree page |

<!-- this page might be too similiar to results/catid page -->
<!-- how hard would it be for the user to update on their cattree page -->


## sources used