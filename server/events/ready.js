Message = require('../models/messageModel');

module.exports = client => {
    console.log(`Logged in as ${client.user.tag}!`);

    Message.get(function (err, msg) {
        msg.forEach(me => {
            client.channels.find(c => c.id === me.channelID)
            .fetchMessage(me.ID)
            .then(collected => console.log(`Fetched: ${collected.id}`))
            .catch(console.error);
        });
        if (err) return console.log(err);
    });
};