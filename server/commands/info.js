const Discord = require('discord.js');

exports.run = (client, message, args) => {
    //const guild = client.guilds.get('277884453760663562');
    if (args.length === 0) {
        let embed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setDescription("Bla bla bla")
          .setColor("0x9b0004")
          .addField("User tag: ", message.author.tag)        
          .addField("Created at: ", message.author.createdAt);
  
          message.channel.send(embed);
          return;
    } else 
    if (args.length > 0){
        let tmp_user = client.users.find(user => user.username === args[0]);
        if (tmp_user != null ) {
            let embed = new Discord.RichEmbed()
                .setAuthor(tmp_user.username)
                .setDescription("Bla bla bla")
                .setColor("0x9b0004")
                .addField("User tag: ", tmp_user.tag)        
                .addField("Created at: ", tmp_user.createdAt);
            message.channel.send(embed);
            return;
        } else {
            message.channel.send("```fix\nCan't find user.."+
            " Upper case matters! \n"+
            " Correct syntax: -info Username\n```")
                .then (msg => {
                    msg.delete(10000)
                }).catch(console.error);
        }
    }
};

exports.help = {
    name: 'info'
};