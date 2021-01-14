//Controller for middlewares and authentication
const { JWT_SECRET } = require('../keys');
const JWT = require('jsonwebtoken');
User = require('../models/userModel');
Profile = require('../models/profileModel')
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const btoa = require('btoa');
const keys = require('../keys');

signToken = user => {
    return JWT.sign({
      iss: 'DSnetwork.com',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 7) // current time + 1 day
    }, JWT_SECRET);
}

module.exports = {
    //ensure member is authenticated
    ensureAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
        // req.user is available for use here
        return next(); 
      }
      // denied. redirect to login
      res.status(401).json({
        message: "User not logged in."
      })
    },

    //local sign up
    signUp: async (req, res, next) => {
      const { email, password, username } = req.value.body;
  
      // Check if there is a user with the entered email
      User.findOne({ "local.email": email }, function (err, user){ 
        if (user) {
            return res.status(403).json({ error: 'Email is already in use' });
          }
      });
  
      // Create a new user
      const newUser = new User({
        local: {
          email: email,
          password: password
        },
        username: username,
        points: {
          regularPoint: Date.now()
        }
      });
  
        // Generate a salt for passsword
        const salt = await bcrypt.genSalt(10);
        // Hash a password with salt all together
        const passwordHash = await bcrypt.hash(newUser.local.password, salt);
        // Append hashed password to user;
        newUser.local.password = passwordHash;
        //save newUser with hashed password
        newUser.save(function (err, user) {
            if (err) console.log(err);
            Profile.findOne({user: user._id}, function (err, profile) {
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
        });
        // Generate a token and respond with it
        const token = signToken(newUser);
        res.status(200).json({ token });
    },
  
    //log in
    signIn: async (req, res, next) => {
      // Generate a token and respond with it
      const token = signToken(req.user);
      res.status(200).json({ token });
    },
  
    //isnt used yet
    googleOAuth: async (req, res, next) => {
      // Generate a token and respond with it
      const token = signToken(req.user);
      res.status(200).json({ token });
    },
  
    //facebook oauth
    facebookOAuth: async (req, res, next) => {
      // Generate a token and respond with it 
      const token = signToken(req.user);
      res.status(200).json({ token });
    },

    //discord oauth
    discordOAuth: async (req, res, next) => {
      if (req.user == undefined) {
        res.redirect(`${keys.discord.callbackURI}`);
      } else {
        // Generate a token and respond with it
        const token = signToken(req.user);
        res.status(200);
        //console.log("token: ", token);
        res.redirect(`${keys.discord.callbackURI}?token=${token}`);
      }
    },

    //twitch oauth
    twitchOAuth: async (req, res, next) => {
      if (req.user == undefined) {
        res.redirect(`${keys.discord.callbackURI}`);
      } else {
        const token = signToken(req.user);
        res.status(200);
        res.redirect(`${keys.discord.callbackURI}?token=${token}`);
      }
    },
   
    //respose = user id and username
    secret: async (req, res, next) => {
      //console.log("User id: ", req.user._id)
      res.json({ secret: req.user._id,
        username: req.user.username
      });
    },

    //catches discord callback
    discordCallback: async (req, res, next) => {
        if (!req.query.code) throw new Error('NoCodeProvided');
        const code = req.query.code;
        const creds = btoa(`${keys.discord.clientID}:${keys.discord.clientSecret}`);
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${keys.discord.redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });
        const responseJson = await response.json();
        const userData = await fetch('http://discordapp.com/api/users/@me',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${responseJson.access_token}`
            }
        });
        const userDataJson = await userData.json();

        //find user in database or create new user
        try{
            User.findOneAndUpdate({ "discord.id": userDataJson.id },{
                method: 'discord',
                "discord.id": userDataJson.id,
                "discord.email": userDataJson.email,
                "points.regularPoint": Date.now()
            }, {upsert: true}, function(err, user) {
                if (err) return console.log(err);
                if (!user){
                    User.findOne({"discord.id": userDataJson.id}, function (err, user){
                        if (err) return console.log(err);
                        req.user = user;
                        Profile.findOne({user: user._id}, function (err, profile) {
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
                        return next();
                    });
                } else {
                    req.user = user;
                    Profile.findOne({user: user._id}, function (err, profile) {
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
                    return next();
                }
            });
          } catch (error) {
            //error means error , false means no user
            console.log(error);
            res.json(error);
          }
    },

    //send discord data as query
    discordGetData: async (req, res) => {
        if (!req.query.code) throw new Error('NoCodeProvided');
        const code = req.query.code;
        const creds = btoa(`${keys.discord.clientID}:${keys.discord.clientSecret}`);
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${keys.discord.redirectADD}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });
        const responseJson = await response.json();
        const userData = await fetch('http://discordapp.com/api/users/@me',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${responseJson.access_token}`
            }
        });
        const userDataJson = await userData.json();
        
        res.redirect(`${keys.discord.callbackURI}?id=${userDataJson.id}&api=discord&email=${userDataJson.email}`);
    },

    //catches twitch callback
    twitchCallback: async (req, res, next) => {
      if (!req.query.code) throw new Error('NoCodeProvided');
      const code = req.query.code;
      const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${keys.twitch.clientID}&client_secret=${keys.twitch.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${keys.twitch.redirectURI}`,
        {
            method: 'POST'
        });
      const responseJson = await response.json();
      const userData = await fetch('https://api.twitch.tv/helix/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${responseJson.access_token}`,
            "Client-ID": `${keys.twitch.clientID}`
          }
        });
      const userDataJson = await userData.json();
      
      //find user in database
      try {
        User.findOneAndUpdate({"twitch.id": userDataJson.data[0].id}, {
          method: 'twitch',
          "twitch.id": userDataJson.data[0].id,
          "twitch.login": userDataJson.data[0].login,
          "twitch.image": userDataJson.data[0].profile_image_url,
          "twitch.email": userDataJson.data[0].email
        }, {upsert: true}, function(err, user) {
          if (err) return console.log(err);
          if (!user) {
            User.findOne({"twitch.id": userDataJson.data[0].id}, function (err, user){
              if (err) return console.log(err);
              req.user = user;
              Profile.findOne({user: user._id}, function (err, profile) {
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
              return next();
            });
          } else {
            req.user = user;
            Profile.findOne({user: user._id}, function (err, profile) {
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
            return next();
          }
        });
      } catch (error) {
        //error means error , false means no user
        console.log(error);
        res.json(error);
      }
    },

    twitchGetData: async (req, res) => {
        if (!req.query.code) throw new Error('NoCodeProvided');
        const code = req.query.code;
        const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${keys.twitch.clientID}&client_secret=${keys.twitch.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${keys.twitch.redirectADD}`,
            {
                method: 'POST'
            }); 
        const responseJson = await response.json();
        const userData = await fetch('https://api.twitch.tv/helix/users',
            {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${responseJson.access_token}`,
                "Client-ID": `${keys.twitch.clientID}`
            }
            });
        const userDataJson = await userData.json();
            
        res.redirect(`${keys.discord.callbackURI}?id=${userDataJson.data[0].id}&api=twitch&email=${userDataJson.data[0].email}`);
    }
  }