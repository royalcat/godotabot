const util = require('util');
const Discord = require("discord.js");
var http = require('http');
const https = require('https');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var mp3Duration = require('mp3-duration');
const client = new Discord.Client();
var prefix = 'go'

function getRandom(min, max)
{
    return Math.floor(Math.random() * max) + min;
}

function leaveVoice(voiceChannel)
{
    voiceChannel.leave();
}

function soundFile(message, fileName, soundLength)
{
	if(message.member.voiceChannel != null)
		{
			var voiceChannel = message.member.voiceChannel;
			voiceChannel.join().then(connection =>{
				var dispatcher = connection.playFile(fileName);
				dispatcher.setVolume(1);
			})
			setTimeout(leaveVoice, soundLength, voiceChannel);
		}
		else
		{
			message.channel.send("NEIN NEIN NEIN NEIN NEIN NEIN");
		}
}

//client.login(process.env.BOT_TOKEN);
client.login('NDA5OTYwNTgxODk0NzY2NjA1.DWtHig.xaTgFYmG6aOIVh6jtEEXzR8T8Us');

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
		var url = 'http://coub.com/view/'+getRandom()+getRandom()+getRandom()+getRandom()+getRandom();
		message.channel.send(url);
    }

    if(MSG.startsWith(prefix + " sound"))
    {
		var file = "./media/" +MSG.split(' ')[2] + ".mp3";
		
		mp3Duration(file, function (err, duration) {
			if (err) return console.log(err.message);
			if(duration*1000 < 10)
			{
				soundFile(message, file, duration*1000);
			}
		});		
    }
	
	if(MSG.startsWith(prefix + " sound load"))
	{
		if(message.attachments.size == 1)
		{
			var attachment = (message.attachments).array();
			var fileUrl = attachment[0].url;
			var urlLeight = fileUrl.length; 

			var fileName = MSG.split(' ')[3];
			if(fileUrl[urlLeight-1] == '3' && fileUrl[urlLeight-2] == 'p' && fileUrl[urlLeight-3] == 'm' && fileUrl[urlLeight-4] == '.') // быдлокод рулит
			{
				var file = fs.createWriteStream("./media/" + fileName + ".mp3");
				var request = https.get(fileUrl, function (response) {
				response.pipe(file);
				});
			}
			else
			{
				message.channel.send("не тот формат");
			}
		}
		else
		{
			message.channel.send("не подходит");
		}
	}

	if(MSG == prefix +  " slist")
	{
		var path = "./media/";
		var listMsg = "";
		fs.readdir(path, function(err, items) {
			for (var i=0; i<items.length; i++) {
				listMsg += items[i];
			}
		});
		console.log(listMsg);
		//message.channel.send(listMsg);
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
		if(MSG.split(' ')[2] === null)
		{
			commands[0] = "Go dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n"
			commands[1] = "Go random coub - рандомный коуб\n"
			commands[2] = "Go custom call (название) (число) зовет всех в заданное название\n"
			commands[3] = "Go ping - Go pong\n"
			commands[4] = "Go help sound - помошь по звукам\n"
			commands[5] = "Go help fun - всякая всячина\n"
			var text = commands[0]+commands[1]+commands[2]+commands[3]; 
			message.channel.send(normalHelp);
		}
		if(MSG.split(' ')[2] == "sound")
		{
			commands
		}
		if(MSG.split(' ')[2] == "fun")
		{
			
		}

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

