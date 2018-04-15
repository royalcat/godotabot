var bot = require("./bot.js");
var server = require("./server.js");

server.buttonClick.on('godota', function(){
    bot.messageToKonfach("@everyone го дота");
});

server.buttonClick.on('baka', function(){
    bot.baka();
});