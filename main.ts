require('dotenv').config()

import { Client } from "@typeit/discord";
import { DiscordAPIError, Message, TextChannel, VoiceChannel } from "discord.js";

var http = require('http');
const https = require('https');

var fs = require('fs');
var mp3Duration = require('mp3-duration');
var url = require('url');
var querystring = require('querystring');
var staticHost = require('node-static');
var file = new staticHost.Server('.');
var dt = new Date();
var prefix = 'go';
var alf = "0123456789abcdefghijklmnopqrstuvwxyz";
var isDig = false;
var neinMode = false;
 
const client = new Client({
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js` // If you compile using "tsc" the file extension change to .js
    ],
    silent: false,
    variablesChar: ":"
  });



function getRandom(min, max) {
	return Math.floor(Math.random() * max) + min;
}

async function messageToKonfach(msg) {
	const KNFchannel = await client.channels.fetch('248501235232014336');
	if (KNFchannel instanceof TextChannel) {
		KNFchannel.send(msg)
	}

}

async function KonfachVoice(activity) {
	const KNFvoiceChannel = await client.channels.fetch('347724284174532608');
	if (KNFvoiceChannel instanceof VoiceChannel) {
		if (activity == 'join') {
			KNFvoiceChannel.join();
		}
		else {
			KNFvoiceChannel.leave();
		}
	}
}

function setBotGame(name) {
	if (name == '') {
		client.user.setStatus('online')
	}
	else {
		client.user.setActivity(name)
	}
}

function botPlay(fileName) {
	const voiceChannel = client.channels.fetch('347724284174532608');
	if (voiceChannel instanceof VoiceChannel) {
		voiceChannel.join()
			.then(connection => {
				var dispatcher = connection.play("./media/battlecry/" + fileName + ".mp3")
				dispatcher.setVolume(1);
			})
	}
}

	function leaveVoice(voiceChannel) {
		voiceChannel.leave();
	}

	function soundFile(message: Message, fileName, soundLength) {
		if (message.member.voice.channel != null) {
			var voiceChannel = message.member.voice.channel;
			voiceChannel.join()
				.then(connection => {
					console.log(fileName)
					var dispatcher = connection.play(fileName);
					dispatcher.setVolume(1);
				})
				.catch(console.error);
			setTimeout(leaveVoice, soundLength, voiceChannel);
		}
		else {
			message.channel.send("No voice channel");
		}
	}

	function unicSound(connection, file) {
		var dispatcher = connection.playFile(file);
	}

	function MSGreq(message) {
		var MSG = message.content.toLowerCase();

		if (message.author.bot) {
			if (message.content.startsWith("@everyone Go DOTA\nCreating dota party:")) {
				message.react('🙋')
			}

			return; // other bots ignore
		}

		if (MSG == "nein mode" && dt.getDay() == 1 && dt.getMonth() == 4) {
			if (neinMode == true) {
				message.channel.send("NEIN MODE ACTIVATED");
				neinMode = false;
			}
			if (neinMode == false) {
				message.channel.send("NEIN MODE DEACTIVATED");
				neinMode = true;
			}
			return;
		}

		if (neinMode && MSG != "nein mode") {
			if (dt.getDay() == 1 && dt.getMonth() == 4) {
				message.delete();
				message.channel.send(message.author + " NEIN" + "(to off write NEIN MODE)");
			}
			else {
				neinMode = false;
			}
			return;
		}

		if (MSG.startsWith(prefix + " dota")) {
			if (MSG.split(' ')[1] == "dota") {
				if (MSG.length <= 8) {
					message.channel.send("@everyone го дота");
				}
				if (MSG.length > 8) {
					var i = 0;
					var num = parseInt(MSG.replace(/\D+/g, ""));
					if (num > 0 && num < 11 && num != null) {
						while (i != num) {
							message.channel.send("@everyone го дота");
							i++;
						}
					}
					else {
						message.channel.send("Ты шо, охерел?");
					}
				}
			}

			if (MSG.split(' ')[1] == "dota_lobby") {
				const botmessage = message.channel.send(
					"@everyone Go DOTA\n" +
					"Creating dota party:\n" +
					":white_check_mark: " + message.author.username + "\n" +
					":x:\n" +
					":x:\n" +
					":x:\n" +
					":x:\n"
				)
			}
			return;
		}

		if (MSG.startsWith("gs") && message.author.toString() != "<@248417802355081216>") {
			if (MSG.split(' ')[1] == "play") {
				var mediaFilePath = "./media/" + MSG.split(' ')[2] + ".mp3";

				mp3Duration(mediaFilePath, function (err, duration) {
					if (err) return console.log(err.message);
					soundFile(message, mediaFilePath, duration * 1000 + 2000);
				});
			}

			if (MSG.split(' ')[1] == "load") {
				if (message.attachments.size == 1) {
					var attachment = (message.attachments).array();
					var fileUrl = attachment[0].url;
					var urlLeight = fileUrl.length;

					var fileName = MSG.split(' ')[2];
					if (fileUrl[urlLeight - 1] == '3' && fileUrl[urlLeight - 2] == 'p' && fileUrl[urlLeight - 3] == 'm' && fileUrl[urlLeight - 4] == '.') // быдлокод рулит
					{
						var mediaFile = fs.createWriteStream("./media/" + fileName + ".mp3");
						https.get(fileUrl, function (response) {
							response.pipe(mediaFile);
						})
					}
					else {
						message.channel.send("не тот формат");
					}
				}
				else {
					message.channel.send("не подходит");
				}
			}

			if (MSG.split(' ')[1] == "list") {
				var path = "./media/";
				var listMsg = "";
				fs.readdir(path, function (err, items) {
					for (var i = 0; i < items.length; i++) {
						listMsg = listMsg + items[i].split('.')[0] + "\n";
					}
					message.channel.send(listMsg);
				});
			}
			return;
		}

		if (MSG == "уди") {
			var voiceChannel = message.member.voiceChannel;
			voiceChannel.leave();
			return;
		}

		if (MSG == prefix + " ping") {
			message.channel.send("Go pong");
			console.log(message.channel.guild.channels);
			return;
		}

		if (MSG.startsWith(prefix + " help")) {
			var commands = [];
			var text = "";
			if (MSG.split(' ')[2] == "sound") {
				commands[0] = "Go sound play (название файла) - воспроизвести файл в войс\n"
				commands[1] = "Go sound load (название файла) - залить файл на сервер (сбросится после обновы, возможно)\n"
				commands[2] = "Go sound list - список файлов в директории\n"
				text = commands[0] + commands[1] + commands[2];
			}
			if (MSG.split(' ')[2] == "fun") {
				commands[0] = "выкопать зерга"
				commands[1] = "игрек приди"
				text = commands[0] + commands[1];
			}
			else {
				commands[0] = "Go dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n"
				commands[1] = "Go random coub - рандомный коуб\n"
				commands[2] = "Go custom call (название) (число) - зовет всех в заданное название\n"
				commands[3] = "Go ping - Go pong\n"
				commands[4] = "Go help sound - помощь по звукам\n"
				commands[5] = "Go help fun - всякая всячина\n"
				commands[6] = "выкопать (упоминание) - каждые 10 секунд упоминает пользователя\n"
				commands[7] = "выкопался - останавливает все раскопки\n"
				text = "Основые команды бота:\n" + commands[0] + commands[1] + commands[2] + commands[3] + commands[4] + commands[5] + commands[6] + commands[7];
			}
			message.channel.send(text);
			return;
		}

		if (MSG.startsWith(prefix + " custom call ")) {
			var i = 15;
			var game = MSG.substr(15);
			if (parseInt(MSG.replace(/\D+/g, "")) == null) {
				message.channel.send("Go" + game);
			}
			else {
				var num = parseInt(MSG.replace(/\D+/g, ""));
				if (num >= 1 && num <= 9) {
					var gameName = MSG.split(' ')[1].split(' ')[1];
					i = 0;
					do {
						message.channel.send("@everyone Go " + game);
						i++
					} while (i != num)
				}
				else {
					message.channel.send("ОООО ПЕТУШОК НАШЕЛСЯ");
				}
			}
			return;
		}
		
		var tiker: NodeJS.Timeout

		if (MSG.startsWith("выкопать")) {
			var MyUser = MSG.split(' ')[1];
			const tiker = setInterval(function () { message.channel.send("выкопать " + MyUser); }, 10 * 1000);
			return;
		}
		if (MSG.startsWith("выкопался")) {
			clearInterval(tiker);
			return;
		}
	}

	function accept(req, res) {
		if (req.url == '/godota') {
			var body = '';
			req.on('data', function (data) {
				body += data;
				console.log(body.toString());
				setTimeout(messageToKonfach, 3, body.toString());
			});
			return;
		}

		if (req.url == '/voice') {
			req.on('data', function (data) {
				console.log(data.toString());
				setTimeout(KonfachVoice, 3, data.toString());
			});
			return;
		}
		if (req.url == '/mainCtr') {
			req.on('data', function (data) {
				console.log(data.toString());
				setTimeout(setBotGame, 3, data.toString());
			});
			return;
		}
		if (req.url == '/voicePlay') {
			req.on('data', function (data) {
				console.log(data.toString());
				setTimeout(botPlay, 3, data.toString());
			});
			return;
		}
		file.serve(req, res);
	}



	client.login(process.env.BOT_TOKEN);
	client.on('message', (message) => MSGreq(message))

	http.createServer(accept).listen(process.env.PORT || 8080);

