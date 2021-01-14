//emit for testing purposes
exports.run = async (client, message, args) => {
    //add member
    client.emit('guildMemberAdd', message.member)
    //member left
    client.emit('guildMemberRemove', message.member)
};

exports.help ={
    name: 'emit'
};