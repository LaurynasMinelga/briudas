Emoji = require('../models/emojiModel');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

  // Handle index actions
exports.index = function (req, res) {
    Emoji.get(function (err, emojis) {
        if (err) {
            res.status(500)
            res.json({
                status: "error",
                message: err,
            });
        }
        if (isEmptyObject(emojis)) {
            res.json({
                status: "success",
                message: "There are no emojis",
                data: emojis
            });
        } else {
            res.json({
                status: "200",
                message: "emojis retrieved successfully",
                data: emojis
            });
        }
    });
};

// Handle view emoji info
exports.view = function (req, res) {
    Emoji.find({ID: req.params.emoji_id}, function (err, emoji) {
        if (err) {
            res.status(500)
            res.send(err);
        }
        if (isEmptyObject(emoji)){
            res.status(404)
            res.json({
                status: "404",
                message: 'emoji does not exist',
                data: emoji
                });
        } else {
            res.status(200)
            res.json({
            message: 'emoji details loading..',
            data: emoji
            });
        }
        
    });
};