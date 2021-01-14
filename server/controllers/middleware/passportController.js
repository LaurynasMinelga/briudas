const passport = require('passport');
const keys = require('../../keys');
const User = require('../../models/userModel')
const Profile = require('../../models/profileModel')
const bcrypt = require('bcryptjs');

//jwt
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
//local
const LocalStrategy = require('passport-local').Strategy;
//facebook
const FacebookTokenStrategy = require('passport-facebook-token');
//discord
var DiscordStrategy = require('passport-discord').Strategy;
var OAuth2Strategy = require('passport-discord-oauth2').Strategy;

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT_SECRET
  }, async (payload, done) => {
    try {
        // Find the user by data extracted from token
        User.findById(payload.sub, function (err, user) {
            if (err) return console.log(err);
            //console.log(user);
            // If user doesn't exists, null means no error, false means no user
            if (!user) return done(null,false);
            // null means no error, and pass the user
            return done(null, user);
        });
    } catch (error) {
      done(error, false);
    }
  }));

//Facebook Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: keys.facebook.clientID,
  clientSecret: keys.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    User.findOneAndUpdate({ "facebook.id": profile.id },{
        "facebook.id": profile.id,
        "facebook.email": profile.emails[0].value,
        "points.regularPoint": Date.now(),
    }, { upsert: true }, function(err, user){
        if (err) return console.log(err);
        if (!user){
            User.findOne({"facebook.id": profile.id}, function (err, user){
                if (err) return console.log(err);
                Profile.findOne({user: user._id}, function (err, profile) {
                    if (err) return console.log(err);
                    console.log(profile.user);
                    if (!profile) {
                        const newProfile = new Profile({
                            user: user._id,
                            settings: {
                                twitch: {
                                    sharing: true,
                                    panel: false,
                                },
                                discord: {
                                    panel: false,
                                }
                            }
                        });
                        newProfile.save();
                    }
                });
                return done(null, user)
            });
        } else {
            Profile.findOne({user: user._id}, function (err, profile) {
                if (err) return console.log(err);
                console.log(profile.user);
                if (!profile) {
                    const newProfile = new Profile({
                        user: user._id,
                        settings: {
                            twitch: {
                                sharing: true,
                                panel: true,
                            },
                            discord: {
                                panel: true,
                            }
                        }
                    });
                    newProfile.save();
                }
            });
            return done(null, user)
        }
    });
  } catch (error) {
    done(error, false, error.message);
  }
}));

//local strategy 
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      // Find the user given the email
      User.findOne({ "local.email": email },  function (err, user){
        if (err) console.log (err);
        // If user doesn't exist, null means no error , false means no user
        if (!user) return done(null, false);
        // Compare entered password with the one in the database
        const passwordInDB = user.local.password;
        const isMatch = bcrypt.compare(password, passwordInDB);
        if (!isMatch) {
          // null means no error , false means no user
          return done(null, false);
        }
        // null means no error , user means user exists
        done(null, user);
      });
    } catch (error) {
      //error means error , false means no user
      done(error, false);
    }
  }));