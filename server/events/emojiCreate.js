Emoji = require('../models/emojiModel');

module.exports = (client, emoji) => {

    // Add channel to database
        var em = new Emoji();
        em.deleted = emoji.deleted;
        em.ID = emoji.id;
        em.identifier = emoji.identifier;
        em.name = emoji.name;
        em.requiredColons = emoji.requiredColons;

        // save the channel and check for errors
        em.save(function (err) {
            if (err) return console.log(err);
          });
}