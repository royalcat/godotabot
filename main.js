var bot = require("./bot.js");
var server = require("./server.js");
﻿const Discord = require("discord.js");

server.http.createServer(server.accept).listen(process.env.PORT || 8080);
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);
bot.client = client;
client.on('message', (message) => bot.MSGreq(message))
server.buttonClick.on('godota', function(){
    bot.messageToKonfach("@everyone го дота");
});

server.buttonClick.on('baka', function(){
    bot.baka();
});
