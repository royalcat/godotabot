const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = 'Go'

function getRandom()
{
    return Math.floor(Math.random() * 9) + 1;
}
function leaveVoice(voiceChannel)
{
    voiceChannel.leave();
}

client.login(process.env.BOT_TOKEN);

client.on('message', (message) => {
    if(message.content.startsWith("Go dota")) {
        if(message.content.length <= 8)
        {
            message.channel.send("@everyone го дота");   
        }
        if(message.content.length > 8)
        {
            var i = 0;
            var num = parseInt(message.content.replace(/\D+/g,""));
            if(num > 0 && num < 11)
            {
                while(i != num)
                {
                    message.channel.send("@everyone го дота");
                    i++;
                }
            }
            else
            {
                message.channel.send("Ты шо, охерел?");
            }
        }
    }

    if(message.content == "Go random coub")
    {
        message.channel.send("http://coub.com/view/"+getRandom()+getRandom()+getRandom()+getRandom()+getRandom());
    }

    if(message.content == "Go anime")
    {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection =>{
            const dispatcher = connection.playFile('./media/anime.mp3');
            dispatcher.setVolume(1);
        })
        setTimeout(leaveVoice, 5000, voiceChannel);
    }
	
    if(message.content == "Уди")
    {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }
	
	if(message.content == "Go ping")
	{ 
		var time = message.createdAt;
		var now = Date();
		message.channel.send("Go pong (" + Date().getMilliseconds()-time.getMilliseconds()+")");
	}
});

