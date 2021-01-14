exports.run = (client, message, args) => {
    const response = args.join(' ');
    message.delete();
    if (args.length > 0){
        message.channel.send(response);
    } else {
        message.channel.send("```fix\nCan't send empty messages.. "+
        "\nCorrect synttax is:\n -say your-message\n```")
        .then (msg => {
            msg.delete(10000)
        }).catch(console.error);
    }
};

exports.help = {
    name: 'say'
};