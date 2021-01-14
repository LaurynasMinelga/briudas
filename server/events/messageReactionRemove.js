Reaction = require('../models/reactionModel');
Message = require('../models/messageModel');
Emoji = require('../models/emojiModel');
const { id } = require('../../auth.json');

module.exports = (client, messageReaction, user) => {

    Message.find({ID: messageReaction.message.id}, function(err, msg) {

        //remove role from user
        if (msg.length > 0 && !user.bot) {
            Reaction.find({emojiID: messageReaction.emoji.id, 
                messageID: messageReaction.message.id}, function (err, react) {
                    if (react.length > 0){
                        let role = client.guilds.get(id).roles.find(r => r.id === react[0].roleID);
                        if (typeof role !== 'undefined' && role !== null) {
                            client.guilds.get(id).members.get(user.id).removeRole(role).catch(console.error);
                            Reaction.updateOne({emojiID: messageReaction.emoji.id, 
                                messageID: messageReaction.message.id},{
                                    $inc: {count: -1}
                                });
                        }
                    }
            });
        }
    });
};