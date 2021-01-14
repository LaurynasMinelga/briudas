Message = require('../models/messageModel');
Reaction = require('../models/reactionModel');

module.exports = (client, message) => {
    
    Message.findOneAndDelete({ID: message.id}, function (err) {
        if (err) return console.log(err);
    });
    Reaction.deleteMany({messageID: message.id}, function (err) {
        if (err) return console.log(err);
    });
};