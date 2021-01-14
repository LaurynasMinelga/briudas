Member = require('../models/memberModel');
Stat = require('../models/statbot/statModel');

module.exports = (client, member) => {

    //writes to channel
    //get channel
    let userList = member.guild.channels.find(c => c.name === 'test')
    userList.send(`${member.user.tag} has joined **${member.guild}**!`);

    //add user to database
    var me = new Member();
        me.deleted = member.deleted;
        me.displayName = member.displayName;
        me.avatar = member.user.displayAvatarURL;
        me.ID = member.id;
        me.joinedAt = member.joinedAt;
        me.joinedTimestamp = member.joinedTimestamp;
        me.mute = member.mute;
        me.nickname = member.user.username;
        me.serverDeaf = member.serverDeaf;
        me.voicePoints = 0;
        me.voicePointsTotal = 0;
        me.hasAdmin = member.hasPermission("ADMINISTRATOR");
        // save the channel and check for errors
        me.save(function (err) {
            if (err) return console.log(err);
          });

    //update member count
    Stat.findOneAndUpdate({id: 1}, {
        id: 1,
        totalMembers: member.guild.memberCount,
    }, {upsert: true}, function(err) {
        if (err) return console.log(err);
    });
};