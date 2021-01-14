//authentication middleware
User = require('../../models/userModel');
Member = require('../../models/memberModel');

// Check if user has admin permissions
exports.dsAdmin = function (req, res, next) {
    Member.findOne({ID: req.user.discord.id}, function (err, member){
        if (err) return res.status(500).json({error: err});
        if (member && member.hasAdmin) {
            return next();
        } else {
            return res.status(401).json({message: "User does not have permission"});
        }
    })
};

// Check if user has superAdmin
exports.superAdmin = function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user){
        if (err) res.status(500).json({error: err});
        if (user && user.roles.superAdmin) {
                return next();
        } else {
            return res.status(401).json({message: "User does not have permission"});
        }
    })
}

//check if user has webAdmin
exports.webAdmin = function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user){
        if (err) res.status(500).json({error: err});
        if (user && user.roles.webAdmin) {
                return next();
        } else {
            return res.status(401).json({message: "User does not have permission"});
        }
    })
}

//logout user
exports.logout = function (req, res) {
    req.logout();
    //console.log("loggedout");
    return res.status(200).json({message: "success"});
}