const startMessage = `Привет, %s! Я помогу загрузить или обновить презентацию.`;

const isMultipleDaysConference = process.env.conference_days
    && process.env.conference_days.split(",").length > 1;
const conferenceDaysArray = process.env.conference_days ?
    process.env.conference_days.split(",").map(item => item.trim()) : [];
const getDayQuestion = `В какой день ты выступаешь?`
const getDayKeyboard = {reply_markup: {keyboard: [conferenceDaysArray], resize_keyboard: true, one_time_keyboard: true}};

const isMultipleHallsConference = process.env.conference_halls
    && process.env.conference_halls.split(",").length > 1;
let conferenceHallsArray = process.env.conference_halls ?
    process.env.conference_halls.split(",").map(item => item.trim()) : [];
if (isMultipleDaysConference) {
    conferenceHallsArray = conferenceHallsArray.concat('◀️ Назад');
}
const getHallQuestion = `В каком зале твоё выступление?`;
const getHallKeyboard = {
    reply_markup: {
        keyboard: [conferenceHallsArray],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

const getFileKeyboard = isMultipleDaysConference || isMultipleHallsConference ?
    {reply_markup: {keyboard: [['◀️ Назад']], resize_keyboard: true, one_time_keyboard: true}} : {};
const getFileQuestion = `Приложи файл презентации.`;
const getFileSuccessMessage = 'Отлично, спасибо, обновил. Удачного выступления!';
const getFileSticker = 'CAACAgIAAxkBAAFSv2thAAFFWIAAAYMkoOZgYLOZBcSpJCEUAALwDAACqATZSaBxjXWrhwd2IAQ';
const getFileFailMessage = 'К сожалению, не могу сохранить файл :( Напиши в личку куратору.';

const finishKeyboard = {
    reply_markup: {
        keyboard: [['Обновить презентацию']],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

const slidesChatSuccess = 'Обновил на диске.'
module.exports = {
    startMessage, getDayKeyboard, getDayQuestion, getHallQuestion, getHallKeyboard, finishKeyboard,
    getFileQuestion, getFileKeyboard, getFileSticker, getFileFailMessage, getFileSuccessMessage,
    isMultipleDaysConference, isMultipleHallsConference, conferenceHallsArray, conferenceDaysArray,
    slidesChatSuccess
};