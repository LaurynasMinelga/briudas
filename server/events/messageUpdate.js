const auth = require('../../auth.json');
Message = require('../models/messageModel');

module.exports = (client, oldMessage, message) => {

    Message.find({ID: oldMessage}, function(err, msg) {
        if (err) return console.log(err);
        if (msg.length > 0) {
            //update channel and save to database
            Message.findOneAndUpdate({ID: oldMessage.id}, {
                channelID: message.channel.id,
                content: message.content,
                ID: message.id,
                deleted: message.deleted,
                description: message.embeds[0].description,
                footer: message.embeds[0].footer,
                hexColor: message.embeds[0].hexColor,
                title: message.embeds[0].title
            },function(err, numberAffected, rawResponse) {
                if (err) return console.log(err);
            });
        }
    });
};