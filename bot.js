require('dotenv').config();
const useKeyboard = require('./keyboard');
const botFunctions = require('./bot_functions');
const messages = require('./messages');
const TgBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TgBot(token, {
    polling: true
});

let note = {};
let currentDate = new Date();

bot.on('message', msg => {
    let userId = msg.from.id;
    messages.setUserId(userId);

    switch (msg.text) {
        case '/start':
            botFunctions.resetTimeToWork();
            bot.sendMessage(userId, ('Hello, ' + msg.from.first_name + '!\n' + messages.botMessages('firstStart')), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard:useKeyboard.startKeyboard
                }
            });
            break;
        case 'START':
            botFunctions.clrTimeout();
            bot.sendMessage(userId, messages.botMessages('startBtn'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: useKeyboard.intervalsKeyboard
                }
            });
            break;
        case 'STOP':
            botFunctions.resetTimeToWork();
            botFunctions.clrTimeout();
            bot.sendMessage(userId, messages.botMessages('stopBtn'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: useKeyboard.startKeyboard
                }
            });
            break;
        case 'PAUSE':
            botFunctions.clrTimeout();
            bot.sendMessage(userId, messages.botMessages('pauseBtn'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: useKeyboard.pauseKeyboard
                }
            });
            break;
        case 'RESUME':
            bot.sendMessage(userId, messages.botMessages('resumeBtn'), {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: useKeyboard.stopKeyboard
                }
            }).then(() => {
                botFunctions.countdown(bot, note, true);
            })
            break;
        case '/help':
            messages.botSendMyMessage('helpBtn');
            break;
        default:
            break;
    }
})

bot.onText(/(\d{1,4})( |:)(\d{1,4})/, (msg, match) => {
    botFunctions.resetTimeToWork();
    let promise = new Promise((resolve, reject) => {
        if (/([1-9]\d{0,3})( )([1-9]\d{0,3})/.test(match[0])) {
            note = botFunctions.notePreparing(msg, match);
            resolve();
        }
        else {
            let res = match[0].split(':');
            note.startHours = res[0];
            note.startMinutes = res[1];
            currentDate.setHours(res[0]);
            resolve();
        }
    });
    promise.then(() => {
        botFunctions.countdown(bot, note);
    });
    promise.catch(error => {
        console.log(error);
    });
})

setInterval(() => {
    console.log("Main: " + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
    currentDate.setSeconds(currentDate.getSeconds() + 1);
    botFunctions.setNewTime(currentDate);
}, 1000);

setInterval(() => {
    let updateHours = currentDate.getHours();
    currentDate = new Date();
    currentDate.setHours(updateHours)
    console.log('New Time: ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds());
}, 20000);


module.exports = bot;

