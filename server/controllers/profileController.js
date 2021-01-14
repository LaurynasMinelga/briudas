//Controller for user profile
Profile = require('../models/profileModel');
User = require('../models/userModel');

//POST Create new user profile (req.user._id) -self
exports.new = function (req, res) {
    Profile.find({user: req.user._id}, function (err, profile){
        if (profile.length >0){
            return res.status(409).json ({error: "User already has profile"})
        } else {
            var prof = new Profile();
            prof.user = req.user._id;
            prof.name = req.body.name;
            prof.languages = req.body.languages;
            //prof.languages.push(req.body.languages);
            prof.about = req.body.about;
            prof.birthday = req.body.birthday;
            prof.city = req.body.city;
            prof.social.instagram = req.body.instagram;
            prof.social.facebook = req.body.facebook;
            prof.social.twitter = req.body.twitter;
            prof.social.spotify = req.body.spotify;
            prof.social.youtube = req.body.youtube;
            prof.social.reddit = req.body.reddit;
            prof.apps.steam = req.body.steam;
            prof.apps.blizzard = req.body.blizzard;
            prof.apps.origin = req.body.origin;

            prof.save(function (err){
                if (err) return res.status(500).json({error: err});
                return res.status(200).json({message: 'Profile created'});
            });
        }
    });
};

//GET Get user profile data (req.param.user_id)
exports.view = function (req, res) {
    Profile.findOne({user: req.params.user_id},'-_id -user',function (err, profile){
        if (err) return res.status(500).json({error: err});
        if (profile) {
            return res.status(200).json({data: profile});
        } else {
            return res.status(404).json({message: 'Profile not found..'});
        }
    });
};

//PATCH Update user twitch settings data (req.user)
exports.updateSettingsTwitch = function (req, res) {
    Profile.findOneAndUpdate({user: req.user._id}, {
       'settings.twitch.sharing': req.body.sharing,
       'settings.twitch.panel': req.body.panel,
    }, function (err, profile){
        if (err) return res.status(404).json({message: 'Profile not found..'});
        return res.status(200).json({data: profile});
    });
};

//PATCH Update user discord settings data (req.user)
exports.updateSettingsDiscord = function (req, res) {
    Profile.findOneAndUpdate({user: req.user._id}, {
        'settings.discord.panel': req.body.panel,
    }, function (err, profile){
        if (err) return res.status(404).json({message: 'Profile not found..'});
        return res.status(200).json({data: profile});
    });
};

//PATCH Update user apps data (req.user)
exports.updateAboutInfo = function (req, res) {
    Profile.findOneAndUpdate({user: req.user._id}, {
        
        name: req.body.name,
        surname: req.body.surname,
        nickname: req.body.nickname,
        about: req.body.about,
        birthday: req.body.birthday,
        city: req.body.city,
    }, function (err, profile){
        if (err) return res.status(404).json({message: 'Profile not found..'});
        return res.status(200).json({data: profile});
    });
};
