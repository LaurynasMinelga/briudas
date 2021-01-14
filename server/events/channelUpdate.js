Channel = require('../models/channelModel');
const { id } = require('../../auth.json');

module.exports = (client, oldChannel, channel) => {

    //update channel and save to database

    Channel.findOne({ID: oldChannel.id}, function (err, ch) {
        ch.createdAt = channel.createdAt;
        ch.deleted = channel.deleted;
        ch.ID = channel.id;
        ch.name = client.guilds.get(id).channels.get(channel.id).name;
        ch.position = client.guilds.get(id).channels.get(channel.id).position;
        ch.type = channel.type;
        
        if (ch.voicePointsTotal == undefined) {
            ch.voicePointsTotal = 0;
        }

        ch.save(function (err) {
            if (err) return console.log(err);
        });
    });
}