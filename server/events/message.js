const auth = require('../../auth.json');
StatMessage = require('../models/statbot/statMessageModel');

module.exports = (client, message) => {

    if (message.content.indexOf(auth.prefix) !== 0) {
        // Statbot add data to db
        var sMessage = new StatMessage();
            sMessage.author = message.author.id;
            sMessage.channelID = message.channel.id;
            sMessage.createdAt = message.createdAt;
            sMessage.createdTimestamp = message.createdTimestamp;
        // save the statMessage and check for errors
        sMessage.save(function (err) {
            if (err) return console.log(err);
        });
        return;
    } 

    //listen for commands
    const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //-mute @user 12h reason
    //command  0   1    2    ...

    const cmd = client.commands.get(command);
    if (!cmd) return;
    
    cmd.run(client, message, args);
};