Member = require('../models/memberModel');
Stat = require('../models/statbot/statModel');

module.exports = (client, member) => {

    //write to channel
    //get channel
    let userList = member.guild.channels.find(c => c.name === 'test')
    userList.send(`${member.user.tag} has left **${member.guild}**!`);

    // delete member from database
    Member.deleteOne({ ID: member.id }, function (err) {
        if (err) return console.log(err);
    });

    //update member count
    Stat.findOneAndUpdate({id: 1}, {
        id: 1,
        totalMembers: member.guild.memberCount,
    }, {upsert: true}, function (err) {
        if (err) return console.log(err);
    });
}