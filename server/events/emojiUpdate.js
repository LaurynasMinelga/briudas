Emoji = require('../models/emojiModel');

module.exports = (client, oldEmoji, emoji) => {

    //update emoji and save to database
    Emoji.findOneAndUpdate({ID: oldEmoji.id}, {
        deleted: emoji.deleted, 
        ID: emoji.id, 
        identifier: emoji.identifier,
        name: emoji.name,
        requiredColons: emoji.requiredColons
    }, { upsert: true }, function(err, numberAffected, rawResponse) {
        if (err) return console.log(err);
    });
} 