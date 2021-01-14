// Users controller
User = require('../models/userModel');
Profile = require('../models/profileModel');
Config = require('../config/config');
const bcrypt = require('bcryptjs');

//GET Returns all users filtered list () -public
exports.getAll = function (req, res) {
    User.find({},'username name roles _id discord.id discord.email', function (err, users){
        if (err) return res.status(500).json(err);
        if (!users) {
            res.status(404).json({message: "There are no users"});
        } else {
            res.status(200).json({data: users});
        }
    });
};

//GET specific user filtered info (req.params.user_id) -public
exports.getOne = function (req, res) { 
    User.findById(req.params.user_id,'username name roles _id facebook.id discord.id twitch.id',function (err, user) {
        if (err) return res.status(500).json({error: err});
        if (!user){
            res.status(404).json({message: 'User does not exist'});
        } else {
            res.status(200).json({data: user});
        }
    });
};
 
//GET user-self data filtered (req.user._id) -self
exports.me = function (req, res){
    User.findById(req.user._id,'username name roles _id facebook discord twitch',function (err, user) {
        if (err) return res.status(500).json({error: err});
        if (!user){
            res.status(404).json({message: 'User does not exist'});
        } else {
            res.status(200).json({data: user});
        }
    });
};

//PUT add local login to non-local users (req.user._id)
exports.addCredentials = async function (req, res) {
    // Generate a salt for password
    const salt = await bcrypt.genSalt(10);
    // Hash a password with salt all together
    var pass_tmp = req.body.password
    //console.log(req.body.password);
    const passwordHash = await bcrypt.hash(pass_tmp, salt);
    User.findOneAndUpdate({_id: req.user._id}, {
        "local.email": req.body.email,
        "local.password": passwordHash
    },function(err) {
        if (err) res.json(err);
        res.status(200).json({ message: 'User updated' });
    });
}; 

//PATCH add roles to other users (req.user._id req.params.user_id) -superAdmin
exports.updateRole = function (req, res) {
    User.findOneAndUpdate({_id: req.params.user_id}, {
        roles: {
            superAdmin: req.body.superAdmin,
            webAdmin: req.body.webAdmin,
            dsAdmin: req.body.dsAdmin
        }
    },function(err) {
        if (err) res.json(err);
        //console.log("user updated");
        return res.status(200).json({ message: 'User updated' });
    });
};

//DELETE user from system (req.user._id) -self
exports.delete = function (req, res) {
    User.remove({ _id: req.user._id }, function (err, user) {
        if (err) return res.status(500).json({error: err});   
    });
    Profile.remove({ user: req.user._id}, function (err, user) {
        if (err) return res.status(500).json({error: err});
    })
};

//POST check for super admin password (req.user._id) -self
exports.adminPassword = function (req, res) {
    if (req.body.password == Config.admin_pass) {
        return res.status(200).json({message: "Password correct"});
    } else {
        return res.status(400).json({message: "Password incorrect"});
    }
}

//GET check which apis user registered (req.user._id) -self
exports.getApis = function (req, res) {
    User.findById(req.user._id, 'facebook.id discord.id twitch.id', function (err, user) {
        if (err) console.log(err);//res.status(500).json(err);
        if (user) {
            res.status(200).json({data: user});
        } else {
            res.status(404).json({message: "User not found"});
        }
    });
}

//POST add discord credentials (req.user._id) -self
exports.discordAdd = function (req, res) {
    User.findOneAndUpdate({_id: req.user._id}, {
        "discord.id": req.body.id,
        "discord.email": req.body.email
    }, function(err) {
        if (err) res.json(err);
        return res.status(200).json({ message: 'User updated' });
    })
}

//POST add twitch credentials (req.user._id) -self
exports.twitchAdd = function (req, res) {
    User.findOneAndUpdate({_id: req.user._id}, {
        "twitch.id": req.body.id,
        "twitch.email": req.body.email
    }, function(err) {
        if (err) res.json(err);
        return res.status(200).json({ message: 'User updated' });
    })
}