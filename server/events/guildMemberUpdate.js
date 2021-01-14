Member = require('../models/memberModel');

module.exports = (client, oldMember, member) => {
    //update member and save to database
    /*
    Member.findOneAndUpdate({ID: oldMember.id}, {
        deleted: member.deleted,
        displayName: member.displayName,
        ID: member.id,
        joinedAt: member.joinedAt,
        joinedTimestam: member.joinedTimestamp,
        mute: member.mute,
        nickname: member.nickname,
        serverDeaf: member.serverDeaf,
        hasAdmin: member.hasPermission("ADMINISTRATOR"),
    }, { upsert: true }, function(err, numberAffected, rawResponse) {
        if (err) return console.log(err);
    }); */

    Member.findOne({ID: oldMember.id}, function (err, me){
        if (err) return console.log(err);

        me.deleted = member.deleted;
        me.displayName = member.displayName;
        me.avatar = member.user.displayAvatarURL;
        me.ID = member.id;
        me.joinedAt = member.joinedAt;
        me.joinedTimestam = member.joinedTimestamp;
        me.mute = member.mute;
        me.nickname = member.user.username;
        me.serverDeaf = member.serverDeaf;
        me.hasAdmin = member.hasPermission("ADMINISTRATOR");
        if (me.voicePointsTotal == undefined) {
            me.voicePointsTotal = 0;
        }
        
        me.save(function (err) {
            if (err) return console.log(err);
        });
    });
};