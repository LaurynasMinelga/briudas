// Filename: routes.js
// Initialize express router
let router = require('express').Router();
const passport = require('passport');
const keys = require('./keys');
require('./controllers/middleware/passportController');

//import auth
const { validateBody, schemas } = require('./controllers/validators');
const passportSignIn = passport.authenticate('local', { session: false });

//import middleware
var authController = require('./controllers/middleware/authController');
const JWTauth = passport.authenticate('jwt', { session: false });

// Import controllers
var userController = require('./controllers/usersController');
var guildController = require('./controllers/guildController');
var reactionController = require('./controllers/reactionController');
var messageController = require('./controllers/messageController');
var channelController = require('./controllers/channelController');
var emojiController = require('./controllers/emojiController');
var roleController = require('./controllers/roleController');
var sessionController = require('./controllers/sessionController');
var profileController = require('./controllers/profileController');
var pointController = require('./controllers/pointsController');
var statBotController = require('./controllers/bot/statBotController');

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Working',
        message: 'Waswas214'
    });
});

//----------------AUTH routes------------------------------

// sign up with email
router.route('/signup')
.post(validateBody(schemas.signUpSchema),
    sessionController.signUp);

// login with email
router.route('/signin')
.post(validateBody(schemas.signInSchema),
passportSignIn,
sessionController.signIn);

//sign up with facebook auth
router.route('/facebook')
.post(passport.authenticate('facebookToken', 
    { session: false }),
    sessionController.facebookOAuth
);

//sign up with discord auth
router.route('/discord/callback')
.get(sessionController.discordCallback,
    sessionController.discordOAuth);

//add discord data to account
router.route('/discord/add')
.get(sessionController.discordGetData) // get data from discord api and redirect to frontend
.post(JWTauth,userController.discordAdd); // add discord creds to db

//sign up with twitch auth
router.route('/twitch/callback')
.get(sessionController.twitchCallback,
    sessionController.twitchOAuth);

router.route('/twitch/add')
.get(sessionController.twitchGetData) // get data from twitch api and redirect to frontend
.post(JWTauth, userController.twitchAdd); // add twitch creds to db

//get authenticated user id and username
router.route('/secret')
.get(JWTauth,sessionController.secret);

router.route('/logout')
.get(JWTauth, authController.logout); //logout user

//----------------USER routes------------------------------

// User-self methods routes
router.route('/me')
.put(JWTauth, userController.addCredentials) // add local data to user
.get(JWTauth, userController.me) //get user-self data
.delete(JWTauth, userController.delete); //delete user

//Admin
router.route('/admin')
.post(JWTauth, userController.adminPassword); // check if admin pass maches

// User routes
router.route('/users')
.get(userController.getAll) //get all users

router.route('/users/:user_id')
.get(userController.getOne); // get specific user

router.route('/users/:user_id/roles')
.patch(/*authController.superAdmin*/JWTauth ,userController.updateRole); // update user roles

router.route('/apis')
.get(JWTauth,userController.getApis) // check which apis user has connected
//----------------PROFILE routes------------------------------

router.route('/profiles')
.post(JWTauth, profileController.new) // create new profile

router.route('/profiles/twitch')
.patch(JWTauth, profileController.updateSettingsTwitch); // update twitch settings

router.route('/profiles/discord')
.patch(JWTauth, profileController.updateSettingsDiscord); // update discord settings

router.route('/profiles/about')
.patch(JWTauth, profileController.updateAboutInfo); // update profile apps info

router.route('/profiles/:user_id')
.get(profileController.view) // get profile info 

//----------------POINTS routes------------------------------
router.route('/points/nextpoint')
.get(JWTauth, pointController.nextPoint); // get time untill next point

router.route('/points/:user_id')
.get(JWTauth, pointController.nextReceive) // get time untill next receive
.post(JWTauth, pointController.add) // add point
.put(JWTauth, pointController.remove); // remove point

router.route('/points/:user_id/given')
.get(pointController.given); // get all given points

router.route('/points/:user_id/given/sum')
.get(pointController.sumGiven); // get given points sum

router.route('/points/:user_id/received')
.get(pointController.received); // get all received points

router.route('/points/:user_id/received/sum')
.get(pointController.sumReceived); // get received points sum

router.route('/points/top/five') 
.put(pointController.top); // get top users in leaderboard

//----------------GUILD routes------------------------------

router.route('/guilds')
.get(JWTauth,authController.superAdmin,guildController.index); // get guild data

router.route('/guilds/public')
.get(guildController.public);

//----------------GUILD REACTIONS routes---------------------

router.route('/reactions/:message_id')
.get(JWTauth,authController.dsAdmin,
    reactionController.getReactions) // get all reactions by message
.patch(JWTauth,authController.dsAdmin, 
    reactionController.updateOne); // update one reaction

//----------------MESSAGES routes------------------------------

router.route('/messages/:channel_id')
.get(JWTauth, authController.dsAdmin,
    messageController.getFromChannel); // get all channel messages

router.route('/messages/:message_id/message')
.get(JWTauth, authController.dsAdmin,
    messageController.getOne) // get one message
.patch(JWTauth, authController.dsAdmin,
    messageController.updateOne); //update one message

//----------------GUILD CHANNELS routes------------------------------

router.route('/channels')
.get(JWTauth,authController.dsAdmin,
    channelController.index); // get all channels containing messages

//----------------GUILD EMOJIES routes------------------------------
router.route('/emojis')
.get(emojiController.index);

router.route('/emojis/:emoji_id')
.get(emojiController.view);

//----------------GUILD ROLES routes------------------------------
router.route('/roles')
.get(JWTauth,authController.dsAdmin,
    roleController.index); // get all roles from guild 

//----------------STATBOT routes------------------------------
router.route('/stat/voiceuserlist/total') // get best voice users total
.get(JWTauth, statBotController.voiceUserListTotal);

router.route('/stat/voicechannellist/total')
.get(JWTauth, statBotController.voiceChannelListTotal); //get best voice channels total

router.route('/stat/messageuserlist/total')
.get(JWTauth, statBotController.messageUserListTotal); //get best message users total

router.route('/stat/messagechannellist/total')
.get(JWTauth, statBotController.messageChannelListTotal); //get best message channels total


// Export API routes
module.exports = router;