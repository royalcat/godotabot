const Discord = require("discord.js");
var http = require('http');
const https = require('https');
var fs = require('fs');
var mp3Duration = require('mp3-duration');
const client = new Discord.Client();
var prefix = 'go';
var dt = new Date();

function getRandom(min, max)
{
    return Math.floor(Math.random() * max) + min;
}

function leaveVoice(voiceChannel)
{
    voiceChannel.leave();
}

function soundFile(message, fileName, soundLength, notCompleteMessage)
{
	if(message.member.voiceChannel != null)
		{
			var voiceChannel = message.member.voiceChannel;
			voiceChannel.join()
				.then(connection =>{
					var dispatcher = connection.playFile(fileName);
					dispatcher.setVolume(1);
				})
				.catch(console.error);
			setTimeout(leaveVoice, soundLength, voiceChannel);
		}
		else
		{
			message.channel.send("NEIN NEIN NEIN NEIN NEIN NEIN");
		}
}

client.login(process.env.BOT_TOKEN);

client.on('message', (message) => 
{
	var MSG = message.content.toLowerCase();

	if(MSG.startsWith(prefix +" dota"))
	{
        if(MSG.length <= 8)
        {
            message.channel.send("@everyone го дота");   
        }
        if(MSG.length > 8)
        {
            var i = 0;
            var num = parseInt(MSG.replace(/\D+/g,""));
            if(num > 0 && num < 11 && num != null)
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

    if(MSG.startsWith("gs") && message.author.toString() != "<@248417802355081216>")
    {
		if(MSG.split(' ')[1] == "play")
		{
			var file = "./media/" +MSG.split(' ')[2] + ".mp3";
			
			mp3Duration(file, function (err, duration) {
				if (err) return console.log(err.message);
				soundFile(message, file, duration*1000+2000);
			});
		}

		if(MSG.split(' ')[1] == "load")
		{
			if(message.attachments.size == 1)
			{
				var attachment = (message.attachments).array();
				var fileUrl = attachment[0].url;
				var urlLeight = fileUrl.length; 

				var fileName = MSG.split(' ')[2];
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

		if(MSG.split(' ')[1] == "list")
		{
			var path = "./media/";
			var listMsg = "";
			fs.readdir(path, function(err, items) 
			{
				for (var i=0; i<items.length; i++) 
				{				
					listMsg = listMsg + items[i].split('.')[0] +"\n";
				}
				message.channel.send(listMsg);
			});		
		}		
	}

	if(MSG.startsWith("gm") && message.author.toString() != "<@248417802355081216>")
    {
		if(MSG.split(' ')[1] == "play")
		{
			var file = "./music/" +MSG.split(' ')[2] + ".mp3";
			
			mp3Duration(file, function (err, duration) {
				if (err) return console.log(err.message);
				soundFile(message, file, duration*1000+2000);
			});
		}

		if(MSG.split(' ')[1] == "load")
		{
			if(message.attachments.size == 1)
			{
				var attachment = (message.attachments).array();
				var fileUrl = attachment[0].url;
				var urlLeight = fileUrl.length; 

				var fileName = MSG.split(' ')[2];
				if(fileUrl[urlLeight-1] == '3' && fileUrl[urlLeight-2] == 'p' && fileUrl[urlLeight-3] == 'm' && fileUrl[urlLeight-4] == '.') // быдлокод рулит
				{
					var file = fs.createWriteStream("./music/" + fileName + ".mp3");
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

		if(MSG.split(' ')[1] == "list")
		{
			var path = "./music/";
			var listMsg = "";
			fs.readdir(path, function(err, items) 
			{
				for (var i=0; i<items.length; i++) 
				{				
					listMsg = listMsg + items[i].split('.')[0] +"\n";
				}
				message.channel.send(listMsg);
			});		
		}
	
	}

    if(MSG == "уди")
    {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }
	
	if(MSG == prefix + " ping")
	{ 
		message.channel.send("Go pong");
	}
	
	if(MSG.startsWith(prefix + " help"))
	{
		var commands =[];
		var text = "";
		if(MSG.split(' ')[2] == "sound")
		{
			commands[0] = "Go sound play (название файла) - воспроизвести файл в войс\n"
			commands[1] = "Go sound load (название файла) - зайлить файл на сервер (сбросится после обновы, возможно)\n"
			commands[2] = "Go sound list - список файлов в директории\n"
			text = commands[0] + commands[1] + commands[2];
		}
		if(MSG.split(' ')[2] == "fun")
		{
			commands[0] = "выкопать зерга"
			commands[1] = "игрек приди"
			text = commands[0] + commands[1];
		}
		else
		{
			commands[0] = "Go dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n"
			commands[1] = "Go random coub - рандомный коуб\n"
			commands[2] = "Go custom call (название) (число) зовет всех в заданное название\n"
			commands[3] = "Go ping - Go pong\n"
			commands[4] = "Go help sound - помошь по звукам\n"
			commands[5] = "Go help fun - всякая всячина\n"
			text = "Основые команды бота:\n"+commands[0]+commands[1]+commands[2]+commands[3]+commands[4]+commands[5]; 
		}
		message.channel.send(text);
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

	if(MSG == "выкопать зерга")
	{
		for(var i = 0; i<10; i++)
		{
			message.channel.send("<@248082882000715776> выкопайся");
		}
	}
});

var static = require('node-static');
var file = new static.Server('.');

http.createServer(function(req, res) {
  file.serve(req, res);
}).listen(8080);