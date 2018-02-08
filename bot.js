const Discord = require("discord.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
        do
	{
		var url = 'http://coub.com/view/'+getRandom()+getRandom()+getRandom()+getRandom()+getRandom();
		var req = new XMLHttpRequest();
		req.open('GET', 'proxy.php?url='+url, false);
	} while(req.find('Page not found') == -1)

        message.channel.send(url);
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
	
	if(message.content == prefix + " help")
	{
		var commands =[];
		commands[0] = "Go - префикс для всех команд, далее его не будет\n";
		commands[1] = "1.anime - кричит - Что поцаны Аниме? - в ваш голосовой чат\n"
		commands[2] = "2.dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n"
		commands[3] = "3.random coub - рандомный коуб\n"
		commands[4] = "4.custom call (название) (число) зовет всех в заданное название\n"
		
		message.channel.send(commands[0]+commands[1]+commands[2]+commands[3]+commands[4]);
	}
	
	if(message.content.startsWith(prefix +" custom call "))
	{
		var i = 15;
		var game = message.content.substr(15);
		if(parseInt(message.content.replace(/\D+/g,"")) == null)
		{
			message.channel.send("Go" + game);
		}
		else
		{
			var num = parseInt(message.content.replace(/\D+/g,""));
			if(num > 1 && num <=10)
			{
				var gameName = message.content.split(' ')[1].split(' ')[0];
				i=0;
				do
				{
					message.channel.send("@everyone Go " + game);
					i++
				}while(i != num)
			}
			else
			{
				message.channel.send("ОООО ПЕТУШОК НАШЕЛСЯ");
			}
		}
	}
});

