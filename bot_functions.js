const useKeyboard = require('./keyboard');
let timerId;
let infoObject;
let currentDate = new Date();
let bot;
let timeToWork = true;

function toMinuteFormat(minute) {
    if (Math.floor(minute / 10) == 0)
        return '0' + minute;
    else
        return minute;
}

function clrTimeout() {
    clearTimeout(timerId);
}

function setNewTime(newTime) {
    currentDate = newTime;
}

function resetTimeToWork() {
    timeToWork = true;
}


function countdown(bot_, note, timeFromPause = false) {
    bot = bot_;
    let startDate = new Date();
    let endDate = new Date();
    let currentPlus;
    let promise = new Promise((resolve, reject) => {
        startDate.setHours(currentDate.getHours());
        if (timeFromPause == false)
            currentPlus = note.workTime;
        else
            currentPlus = parseInt(parseInt(infoObject.currentPlus - infoObject.pastMin));
        endDate.setHours(startDate.getHours());
        endDate.setMinutes(startDate.getMinutes() + currentPlus);
        resolve();
    });
    promise.then(() => {
        infoObject = {
            'note': note,
            'startDate': startDate,
            'endDate': endDate,
            'timeToWork': timeToWork,
            'currentPlus': currentPlus
        }
        let noteTxt = `I'll call you after ${infoObject.currentPlus} min`;
        toMinuteFormat(infoObject.endDate.getMinutes());

        bot.sendMessage(note.usID, noteTxt, {
            reply_markup: {
                resize_keyboard: true,
                keyboard: useKeyboard.stopKb
            }
        });
        checkCurTime(infoObject);
    });
    promise.catch(error => {
        console.log(error);
    })
}


function timeLeft() {
    let leftMin = infoObject.currentPlus - infoObject.pastMin;
    let leftHours = parseInt(leftMin / 60);
    let leftMinutes = parseInt(leftMin - (leftHours * 60));

    if (leftHours == 0)
        return (leftMinutes + 'minutes');
    else
        return (leftHours + 'hours' + leftMinutes + 'minutes');
}

function notePreparing(msg, match) {
    clrTimeout(timerId);

    let userId = msg.from.id;
    let work = match[1];
    let relax = match[3];
    let retNote = {
        'usID': userId,
        'workTime': parseInt(work),
        'relaxTime': parseInt(relax)
    }
    return retNote;
}




function checkCurTime() {
    let pastMin = parseInt((currentDate - infoObject.startDate) / 1000 / 60);
    infoObject.pastMin = pastMin;

    if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
        let word;

        if (infoObject.timeToWork == true) {
            timeToWork = false;
            infoObject.timeToWork = false;
            infoObject.currentPlus = infoObject.note.relaxTime;
            word = 'relax';
        } else {

            timeToWork = true;
            infoObject.timeToWork = true;
            infoObject.currentPlus = infoObject.note.workTime;
            word = 'work';
        }

        infoObject.startDate = currentDate;
        infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
        bot.sendMessage(infoObject.note.usID, `It's time to ${word}!\nI'll call you after ${infoObject.currentPlus} min`);
    }
    timerId = setTimeout(checkCurTime, 500);
}


module.exports = {
    'timeLeft': timeLeft,
    'countdown': countdown,
    'clrTimeout': clrTimeout,
    'notePreparing': notePreparing,
    'setNewTime': setNewTime,
    'resetTimeToWork': resetTimeToWork
}