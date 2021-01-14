module.exports = (client, guild, user) => {

    //get channel
    let userList = guild.channels.find(c => c.name === 'test')
    userList.send(`${user.tag} ban has been removed in **${member.guild}**!`);

}