Reaction = require('../models/reactionModel');
Message = require('../models/messageModel');
Emoji = require('../models/emojiModel');
const { id } = require('../../auth.json');

module.exports = (client, messageReaction, user) => {

    //if message exist in database
    Message.find({ID: messageReaction.message.id}, function(err, msg) {
        // if message author is a bot
        if (msg.length > 0 && user.bot) {
            //add reaction to database
            var re = new Reaction();
            re.message_id = msg[0]._id;
            re.count = messageReaction.count;
            re.emojiID = messageReaction.emoji.id;
            re.me = messageReaction.me;
            re.messageID = messageReaction.message.id;
            re.roleID = ""; 
            re.save(function (err) {
                if (err) return console.log(err);
            });
        }

        if (msg.length > 0 && !user.bot) {
            Reaction.find({emojiID: messageReaction.emoji.id, 
                messageID: messageReaction.message.id}, function (err, react) {
                    if (react.length > 0){
                        let role = client.guilds.get(id).roles.find(r => r.id === react[0].roleID);
                        if (typeof role !== 'undefined' && role !== null) {
                            client.guilds.get(id).members.get(user.id).addRole(role).catch(console.error);
                            Reaction.updateOne({emojiID: messageReaction.emoji.id, 
                                messageID: messageReaction.message.id},{
                                    $inc: {count: 1}
                                });
                        }
                    }
            });
        }
    });
};

