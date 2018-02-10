const Discord = require("discord.js");
var find = require('find');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Discord.Client();
var prefix = 'go'

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
	var MSG = message.content.toLowerCase();
    if(MSG.startsWith(prefix +" dota")) {
        if(MSG.length <= 8)
        {
            message.channel.send("@everyone го дота");   
        }
        if(MSG.length > 8)
        {
            var i = 0;
            var num = parseInt(MSG.replace(/\D+/g,""));
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

    if(MSG == prefix +" random coub")
    {
		
    do
	{
		var url = 'http://coub.com/view/'+getRandom()+getRandom()+getRandom()+getRandom()+getRandom();
		var req = new XMLHttpRequest();
		req.open('GET', 'proxy.php?url='+url, false);
	} while(req.find('Page not found') == -1)

        message.channel.send(url);
    }

    if(MSG == prefix +" anime")
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
	
	if(MSG == prefix +" anime")
    {
		if(message.member.voiceChannel != null)
		{
			var voiceChannel = message.member.voiceChannel;
			voiceChannel.join().then(connection =>{
				const dispatcher = connection.playFile('./media/azino.wav');
				dispatcher.setVolume(1);
			})
			setTimeout(leaveVoice, 5000, voiceChannel);
		}
		else
		{
			message.channel.send("777");
		}
    }
	
    if(MSG == "Уди")
    {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }
	
	if(MSG == prefix + " ping")
	{ 
		message.channel.send("Go pong");
	}
	
	if(MSG == prefix + " help")
	{
		var commands =[];
		commands[0] = "Go - префикс для всех команд, далее его не будет\n";
		commands[1] = "1.anime - кричит - Что поцаны Аниме? - в ваш голосовой чат\n"
		commands[2] = "2.dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n"
		commands[3] = "3.random coub - рандомный коуб\n"
		commands[4] = "4.custom call (название) (число) зовет всех в заданное название\n"
		
		message.channel.send(commands[0]+commands[1]+commands[2]+commands[3]+commands[4]);
	}
	
	if(MSG.startsWith(prefix +" custom call "))
	{
		var i = 15;
		var game = MSG.substr(15);
		if(parseInt(MSG.replace(/\D+/g,"")) == null)
		{
			message.channel.send("Go" + game);
		}
		else
		{
			var num = parseInt(MSG.replace(/\D+/g,""));
			if(num >= 1 && num <=9)
			{
				var gameName = MSG.split(' ')[1].split(' ')[1];
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
	if(MSG == "игрек приди")
	{
		for(var i = 0; i < 10; i++)
		{
		message.channel.send("<@249859198605590528> ПРОСНИСЬ");
		}
	}
});

