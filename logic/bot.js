const {Telegraf} = require('telegraf');
const uploader = require('../api/uploader');
const constants = require('../utils/constants')
const axios = require('axios')

const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const stage = new Stage()

const getDay = new Scene('getDay')
stage.register(getDay)
const getHall = new Scene('getHall')
stage.register(getHall)
const getFile = new Scene('getFile')
stage.register(getFile)

const bot = new Telegraf(process.env.bot_token);

bot.use(session())
bot.use(stage.middleware())

async function startLogic(ctx) {
    await ctx.reply(format(constants.startMessage, ctx.from.first_name || 'комрад'));

    if (constants.isMultipleDaysConference) {
        await ctx.scene.enter('getDay');
        return ctx.reply(constants.getDayQuestion, constants.getDayKeyboard);
    } else if (constants.isMultipleHallsConference) {
        await ctx.scene.enter('getHall');
        return ctx.reply(constants.getHallQuestion, constants.getHallKeyboard);
    } else {
        await ctx.scene.enter('getFile');
        return ctx.reply(constants.getFileQuestion);
    }
}

bot.start(async (ctx) => {
    return startLogic(ctx);
});

getDay.on('text', async (ctx) => {
    if (!constants.conferenceDaysArray.includes(ctx.message.text)) {
        return ctx.reply(constants.getDayQuestion, constants.getDayKeyboard);
    }

    ctx.session.day = ctx.message.text;

    if (constants.isMultipleHallsConference) {
        await ctx.scene.enter('getHall');
        return ctx.reply(constants.getHallQuestion, constants.getHallKeyboard);
    } else {
        await ctx.scene.enter('getFile');
        return ctx.reply(constants.getFileQuestion, constants.getFileKeyboard);
    }
})

getHall.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Назад') { // back button appears only in multiple day mode
        await ctx.scene.enter('getDay');
        return ctx.reply(constants.getDayQuestion, constants.getDayKeyboard);
    }

    if (!constants.conferenceHallsArray.includes(ctx.message.text)) {
        return ctx.reply(constants.getHallQuestion, constants.getHallKeyboard);
    }

    ctx.session.hall = ctx.message.text
    await ctx.scene.enter('getFile')
    return ctx.reply(constants.getFileQuestion, constants.getFileKeyboard)
})

getFile.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Назад') {
        if (constants.isMultipleHallsConference) {
            await ctx.scene.enter('getHall')
            return ctx.reply(constants.getHallQuestion, constants.getHallKeyboard);
        } else {
            await ctx.scene.enter('getDay')
            return ctx.reply(constants.getDayQuestion, constants.getDayKeyboard);
        }
    }

    return ctx.reply(constants.getFileQuestion, constants.getFileKeyboard)
})

bot.on('document', async (ctx) => {
    await processDocument(ctx)
        .then(res => {
            console.log('File uploaded successfully');

            ctx.reply(constants.getFileSuccessMessage, constants.finishKeyboard);
            ctx.scene.reset();
            return ctx.replyWithSticker(constants.getFileSticker)
        })
        .catch(err => {
            console.log('error', err);
            ctx.scene.reset();

            return ctx.reply(constants.getFileFailMessage, constants.finishKeyboard);
        });
})

bot.on('text', async (ctx) => {
    return startLogic(ctx)
})

async function processDocument(ctx) {
    console.log('Getting file link via id %s', ctx.message.document.file_id);
    let url = await ctx.telegram.getFileLink(ctx.message.document.file_id);
    console.log('File link: %s', url);
    let file = await axios({url, responseType: 'stream'});
    console.log("Uploaded file from the link");

    const username = ctx.message.from.last_name || ctx.message.from.first_name;
    const filename = username
        + " - "
        + new Date().toISOString().slice(5, 19).replace(/:/g, "-").replace("T", " ")
        + "."
        + ctx.message.document.file_name.split('.').pop();
    return await uploader.upload(file.data, filename, ctx.message.document.mime_type, ctx.session.day, ctx.session.hall);
}

function format(str) {
    let args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

module.exports = {
    bot
}


