Emoji = require('../models/emojiModel');

module.exports = (client, emoji) => {

        // delete channel from database
        Emoji.deleteOne({ ID: emoji.id }, function (err) {
            if (err) return console.log(err);
          });
}