Guild = require('../models/guildModel');

module.exports = (client, oldGuild, guild) => {

        Guild.findOneAndUpdate({ownerID: oldGuild.ownerID}, {
            afkChannel: guild.afkChannel,
            afkChannelID: guild.afkChannelID,
            memberCount: guild.memberCount,
            name: guild.name,
            ownerID: guild.ownerID
        }, { upsert: true}, function (err) {
            if (err) return console.log(err);
        });
}