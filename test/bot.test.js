const TelegramServer = require('telegram-test-api');
// const { Telegraf } = require('telegraf');
process.env['BOT_TOKEN'] = 'sampleToken';
const { bot } = require('../logic/bot')

test('check if module returns Telegraf bot object', () => {
    expect(typeof bot).toBe('object');
    expect(bot).toMatchObject({ options: {}, telegram: {}, context: {}, polling: {} });
})

describe('testing for bot commands', () => {
    // referring to example https://www.npmjs.com/package/telegram-test-api
    const serverConfig = { port: 9000 };
    const token = process.env.BOT_TOKEN;
    let server;
    // let bot;
    beforeAll(() => {
        server = new TelegramServer(serverConfig)
        return server.start().then(() => {
            // bot = new Telegraf(token, { telegram: { apiRoot: server.ApiURL } });

            // override default object options with test params
            bot.telegram.options.apiRoot = server.ApiURL;
            bot.telegram.options.agent = null;
            // console.log(JSON.stringify(bot));

            bot.startPolling();
        }).then(() => {
            return client = server.getClient(token, { timeout: 5000 });
        });
    });

    afterAll(() => {
        return bot.stop().then(() => server.stop());
        // return server.stop();
    });

    test('check if client can sent command to local api server', async () => {
        const message = client.makeCommand('/start');
        const result = await client.sendCommand(message);
        // console.log('result: ', result);
        expect(result.ok).toBe(true);
    });
})
