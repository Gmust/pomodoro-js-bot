let userId;
let bot;

const setupBot =(tgBot)=>{
    bot = tgBot;
}

const setUserId =(id)=>{
    userId = id;
}

const botMessages =(command)=>{
    if(command == `firstStart` ){
        return(`This bot will write you, when you have to work and relax.\n Press start to begin!`);
    }else if(command == `startBtn`){
        return ('You can select the interval or state your own one, for example: 30 15.\n\nMinimum: 1min\nMaximum: 1439min (23h 59min)\n\nNotifications will be sent until then you press or write STOP.\n/\help');
    }else if(command == `pauseBtn`){
        return ('PAUSE')
    }else if(command == `stopBtn`){
        return ('Press START to restart me!');
    }else if(command == `resumeBtn`){
        return ('RESUME');
    }else if(command == `helpBtn`){
        return ('Available commands:\n\n\/start - restart the bot\nSTART - select a new interval\nSTOP - stop working\nPAUSE - pause the timer');
    }

    return command;
}


const botSendMessage =(textOrCommand)=>{
    let txt = botMessages(textOrCommand);
    bot.sendMessage(userId,txt);
}


module.exports ={
    'setupBot': setupBot,
    'setUserId': setUserId,
    'botMessages': botMessages,
    'botSendMyMessage': botSendMessage

}
