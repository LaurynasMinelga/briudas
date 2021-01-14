Channel = require('../models/channelModel');
const { id } = require('../../auth.json');

module.exports = (client, channel) => {

    // Add channel to database
        var ch = new Channel();
        ch.createdAt = channel.createdAt;
        ch.deleted = channel.deleted;
        ch.ID = channel.id;
        ch.name = client.guilds.get(id).channels.get(channel.id).name;
        ch.position = client.guilds.get(id).channels.get(channel.id).position;
        ch.type = channel.type;
        ch.voicePointsTotal = 0;

        // save the channel and check for errors
        ch.save(function (err) {
            if (err) return console.log(err);
          });
}