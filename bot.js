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
    if(message.content.startsWith(prefix +" dota")) {
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

    if(message.content == prefix +" random coub")
    {
        message.channel.send("http://coub.com/view/"+getRandom()+getRandom()+getRandom()+getRandom()+getRandom());
    }

    if(message.content == prefix +" anime")
    {
		if(message.member.voiceChannel != null)
		{
			var voiceChannel = message.member.voiceChannel;
			voiceChannel.join().then(connection =>{
				const dispatcher = connection.playFile('./media/anime.mp3');
				dispatcher.setVolume(1);
			})
			setTimeout(leaveVoice, 5000, voiceChannel);
		}
		else
		{
			message.channel.send("NEIN NEIN NEIN NEIN NEIN NEIN");
		}
    }
	
    if(message.content == "Уди")
    {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }
	
	if(message.content == prefix + " ping")
	{ 
		message.channel.send("Go pong");
	}
	
	if(message.content == prefix + "help")
	{
		
		message.channel.send("Go - префикс для всех комманд, далее его не будет\n1.anime - кричит - Что поцаны Аниме? - в ваш голосовой чат\n2.dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n3.random coub - рандомный коуб\n4.Уди - выгоняет бота из голосового чата");
	}
});

