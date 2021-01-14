const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    await message.delete().catch(O_o => {});

    const one = message.guild.roles.get('548165112716984321');
    const two = message.guild.roles.get('547596736219316225');
    const three = message.guild.roles.get('547597519635349512');

    const filter = (reaction, user) => ['one', 'two', 'three'].includes(reaction.emoji.name) && user.id === message.author.id;

    const embed = new RichEmbed()
        .setTitle('Available roles')
        .setDescription(``)
        .setColor(0xdd9323)
        .addField('Battlefield 5',':one:',false)
        .addField('Battlfield 1',':two:',false)
        .addField('Battlefield 3',':four:',false)
        .setFooter(`ID: ${message.author.id}`)
    
    message.channel.send(embed).then(async msg => {
        await msg.react(':one:');
        await msg.react(':two:');
        await msg.react(':three:');

        msg.awaitReaction(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(collected => {
            
            const reaction = collected.first();
        });
    });
};

exports.help = {
    name: 'roles'
};