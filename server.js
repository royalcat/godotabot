var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const buttonClick = new MyEmitter();

function accept(req, res) {

  // если URL запроса /vote, то...
  if (req.url == '/godota') {
    buttonClick.emit('godota');
  }
  if(req.url == '/baka'){
    buttonClick.emit('baka');
  } else {
    // иначе считаем это запросом к обычному файлу и выводим его
    file.serve(req, res); // (если он есть)
  }

}


// ------ этот код запускает веб-сервер -------
http.createServer(accept).listen(process.env.PORT || 8080);

module.exports.buttonClick = buttonClick;
