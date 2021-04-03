import dotenv = require('dotenv');
dotenv.config();

import * as discord from '@typeit/discord';
import {
  Message,
  TextChannel,
  VoiceChannel
} from 'discord.js';

import http = require('http');
import https = require('https');

import fs = require('fs');
import * as musicMeta from 'music-metadata';
import staticHost = require('maishu-node-static');
const file = new staticHost.Server('.');
const nowDate = new Date();
const prefix = 'go';
let neinMode = false;

const client = new discord.Client({
  'classes': [
    `${__dirname}/*Discord.ts`, `${__dirname}/*Discord.js`,
  ],
  'silent': false,
  'variablesChar': ':',
});


async function messageToKonfach(msg) {
  const KNFchannel = await client.channels.fetch('248501235232014336');
  if (KNFchannel instanceof TextChannel) {
    KNFchannel.send(msg);
  }
}

async function KonfachVoice(activity) {
  const KNFvoiceChannel = await client.channels.fetch('347724284174532608');
  if (KNFvoiceChannel instanceof VoiceChannel) {
    if (activity == 'join') {
      KNFvoiceChannel.join();
    } else {
      KNFvoiceChannel.leave();
    }
  }
}

function setBotGame(name) {
  if (name == '') {
    client.user.setStatus('online');
  } else {
    client.user.setActivity(name);
  }
}

function botPlay(fileName) {
  const voiceChannel = client.channels.fetch('347724284174532608');
  if (voiceChannel instanceof VoiceChannel) {
    voiceChannel.join().then((connection) => {
      const dispatcher = connection.play(`./media/battlecry/${fileName}.mp3`);
      dispatcher.setVolume(1);
    });
  }
}

function leaveVoice(voiceChannel) {
  voiceChannel.leave();
}

function soundFile(message: Message, fileName, soundLength) {
  if (message.member.voice.channel != null) {
    const voiceChannel = message.member.voice.channel;
    voiceChannel
      .join()
      .then((connection) => {
        console.log(fileName);
        const dispatcher = connection.play(fileName);
        dispatcher.setVolume(1);
      })
      .catch(console.error);
    setTimeout(
      leaveVoice,
      soundLength,
      voiceChannel,
    );
  } else {
    message.channel.send('No voice channel');
  }
}

function MSGreq(message) {
  const MSG = message.content.toLowerCase();

  if (message.author.bot) {
    if (message.content.startsWith('@everyone Go DOTA\nCreating dota party:')) {
      message.react('🙋');
    }

    return; // Other bots ignore
  }

  if (MSG == 'nein mode' && nowDate.getDay() == 1 && nowDate.getMonth() == 4) {
    if (neinMode == true) {
      message.channel.send('NEIN MODE ACTIVATED');
      neinMode = false;
    }
    if (neinMode == false) {
      message.channel.send('NEIN MODE DEACTIVATED');
      neinMode = true;
    }
    return;
  }

  if (neinMode && MSG != 'nein mode') {
    if (nowDate.getDay() == 1 && nowDate.getMonth() == 4) {
      message.delete();
      message.channel.send(`${message.author} NEIN` + '(to off write NEIN MODE)');
    } else {
      neinMode = false;
    }
    return;
  }

  if (MSG.startsWith(`${prefix} dota`)) {
    if (MSG.split(' ')[1] == 'dota') {
      if (MSG.length <= 8) {
        message.channel.send('@everyone го дота');
      }
      if (MSG.length > 8) {
        let i = 0;
        const num = parseInt(MSG.replace(
          /\D+/g,
          '',
        ));
        if (num > 0 && num < 11 && num != null) {
          while (i != num) {
            message.channel.send('@everyone го дота');
            i++;
          }
        } else {
          message.channel.send('Ты шо, охерел?');
        }
      }
    }

    if (MSG.split(' ')[1] == 'dota_lobby') {
      message.channel.send(`${'@everyone Go DOTA\n' +
        'Creating dota party:\n' +
        ':white_check_mark: '}${message.author.username
        }\n` +
        ':x:\n' +
        ':x:\n' +
        ':x:\n' +
        ':x:\n');
    }
    return;
  }

  if (
    MSG.startsWith('gs') &&
    message.author.toString() != '<@248417802355081216>'
  ) {
    if (MSG.split(' ')[1] == 'play') {
      const mediaFilePath = `./media/${MSG.split(' ')[2]}.mp3`;

      musicMeta.parseFile(mediaFilePath).then((meta) => {
        soundFile(
          message,
          mediaFilePath,
          meta.format.duration * 1000 + 2000,
        );
      });
    }

    if (MSG.split(' ')[1] == 'load') {
      if (message.attachments.size == 1) {
        const attachment = message.attachments.array();
        const fileUrl = attachment[0].url;
        const urlLeight = fileUrl.length;

        const fileName = MSG.split(' ')[2];
        if (
          fileUrl[urlLeight - 1] == '3' &&
          fileUrl[urlLeight - 2] == 'p' &&
          fileUrl[urlLeight - 3] == 'm' &&
          fileUrl[urlLeight - 4] == '.'
        ) {
          // Быдлокод рулит
          const mediaFile = fs.createWriteStream(`./media/${fileName}.mp3`);
          https.get(
            fileUrl,
            (response) => {
              response.pipe(mediaFile);
            },
          );
        } else {
          message.channel.send('не тот формат');
        }
      } else {
        message.channel.send('не подходит');
      }
    }

    if (MSG.split(' ')[1] == 'list') {
      const path = './media/';
      let listMsg = '';
      fs.readdir(
        path,
        (err, items) => {
          for (let i = 0; i < items.length; i++) {
            listMsg = `${listMsg + items[i].split('.')[0]}\n`;
          }
          message.channel.send(listMsg);
        },
      );
    }
    return;
  }

  if (MSG == 'уди') {
    const { voiceChannel } = message.member;
    voiceChannel.leave();
    return;
  }

  if (MSG == `${prefix} ping`) {
    message.channel.send('Go pong');
    console.log(message.channel.guild.channels);
    return;
  }

  if (MSG.startsWith(`${prefix} help`)) {
    const commands = [];
    let text = '';
    if (MSG.split(' ')[2] == 'sound') {
      commands[0] =
        'Go sound play (название файла) - воспроизвести файл в войс\n';
      commands[1] =
        'Go sound load (название файла) - залить файл на сервер (сбросится после обновы, возможно)\n';
      commands[2] = 'Go sound list - список файлов в директории\n';
      text = commands[0] + commands[1] + commands[2];
    }
    if (MSG.split(' ')[2] == 'fun') {
      commands[0] = 'выкопать зерга';
      commands[1] = 'игрек приди';
      text = commands[0] + commands[1];
    } else {
      commands[0] =
        'Go dota (цифра) - зовет всех в доту нужное количество раз, но не более 10\n';
      commands[1] = 'Go random coub - рандомный коуб\n';
      commands[2] =
        'Go custom call (название) (число) - зовет всех в заданное название\n';
      commands[3] = 'Go ping - Go pong\n';
      commands[4] = 'Go help sound - помощь по звукам\n';
      commands[5] = 'Go help fun - всякая всячина\n';
      commands[6] =
        'выкопать (упоминание) - каждые 10 секунд упоминает пользователя\n';
      commands[7] = 'выкопался - останавливает все раскопки\n';
      text =
        `Основые команды бота:\n${commands[0]
        }${commands[1]
        }${commands[2]
        }${commands[3]
        }${commands[4]
        }${commands[5]
        }${commands[6]
        }${commands[7]}`;
    }
    message.channel.send(text);
    return;
  }

  if (MSG.startsWith(`${prefix} custom call `)) {
    let i = 15;
    const game = MSG.substr(15);
    const repeatN = parseInt(MSG.replace(
      /\D+/g,
      '',
    ));
    if (repeatN == null) {
      message.channel.send(`Go${game}`);
    } else {
      if (repeatN >= 1 && repeatN <= 9) {
        const gameName = MSG.split(' ')[1].split(' ')[1];
        i = 0;
        do {
          message.channel.send(`@everyone Go ${gameName}`);
          i++;
        } while (i != repeatN);
      } else {
        message.channel.send('ОООО ПЕТУШОК НАШЕЛСЯ');
      }
    }
    return;
  }

  let tiker: NodeJS.Timeout;

  if (MSG.startsWith('выкопать')) {
    const MyUser = MSG.split(' ')[1];
    tiker = setInterval(
      () => {
        message.channel.send(`выкопать ${MyUser}`);
      },
      10 * 1000,
    );
    return;
  }
  if (MSG.startsWith('выкопался')) {
    clearInterval(tiker);
  }
}

function accept(req, res) {
  if (req.url == '/godota') {
    let body = '';
    req.on(
      'data',
      (data) => {
        body += data;
        console.log(body.toString());
        setTimeout(
          messageToKonfach,
          3,
          body.toString(),
        );
      },
    );
    return;
  }

  if (req.url == '/voice') {
    req.on(
      'data',
      (data) => {
        console.log(data.toString());
        setTimeout(
          KonfachVoice,
          3,
          data.toString(),
        );
      },
    );
    return;
  }
  if (req.url == '/mainCtr') {
    req.on(
      'data',
      (data) => {
        console.log(data.toString());
        setTimeout(
          setBotGame,
          3,
          data.toString(),
        );
      },
    );
    return;
  }
  if (req.url == '/voicePlay') {
    req.on(
      'data',
      (data) => {
        console.log(data.toString());
        setTimeout(
          botPlay,
          3,
          data.toString(),
        );
      },
    );
    return;
  }
  file.serve(
    req,
    res,
  );
}

client.login(process.env.BOT_TOKEN);
client.on(
  'message',
  (message) => MSGreq(message),
);

http.createServer(accept).listen(process.env.PORT || 8080);
