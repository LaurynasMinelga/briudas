Member = require('../models/memberModel');

module.exports = (client, oldUser, user) => {

    //update channel and save to database
    Member.findOneAndUpdate({ID: oldUser.id}, {
        deleted: user.deleted,
        displayName: user.displayName,
        ID: user.id,
        joinedAt: user.joinedAt,
        joinedTimestamp: user.joinedTimestamp,
        mute: user.mute,
        nickname: user.nickname,
        serverDeaf: user.serverDeaf
    }, { upsert: true },function(err, numberAffected, rawResponse) {
        if (err) return console.log(err);
    });
};