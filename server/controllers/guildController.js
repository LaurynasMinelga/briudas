Guild = require('../models/guildModel');

//GET return guild info (req.user._id) -superAdmin
exports.index = function (req, res) {
    Guild.get(function (err, guilds) {
        if (err) return res.status(500).json({error: err});
        if (guilds) {
            return res.status(200).json({data: guilds});
        } else {
            return res.status(404).json({message: "Guild not found" });
        }
    });
};

//GET public guild info () -public
exports.public = function (req, res) {
    Guild.find({}, 'memberCount name',function (err, guild) {
        if (err) return res.status(500).json({error: err});
        if (guild) {
            return res.status(200).json({data: guild});
        } else {
            return res.status(404).json({message: "Guild not found" });
        }
    });
};