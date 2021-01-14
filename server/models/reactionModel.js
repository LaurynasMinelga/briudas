const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
    message_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
    count: Number,
    emojiID: String, 
    me: Boolean,
    messageID: String,
    roleID: String
});

var Reaction = module.exports = mongoose.model('Reaction', reactionSchema);

module.exports.get = function (callback, limit) {
    Reaction.find(callback).limit(limit);
  }