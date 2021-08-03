const {bot} = require('../logic/bot');
const {successResponse, getErrorResponse} = require('../utils/responseHelper')
const axios = require('axios')

module.exports.setWebhook = async event => {
    try {
        const baseUrl = 'https://' + event.headers.Host + '/' + event.requestContext.stage;
        const telegramWebhookUrl = baseUrl + '/webhook';

        await bot.telegram.setWebhook(telegramWebhookUrl);
        console.log(`Telegram successfully received %s webhook`, telegramWebhookUrl)

        if (process.env.taas_api_key && process.env.direct_download !== "true") {
            const bigFileWebhookUrl = baseUrl + '/uploadBigFile';
            const data = {
                "api_key": process.env.taas_api_key,
                "hook_url": bigFileWebhookUrl,
                "trigger": "new_message"
            }
            await axios.post('https://api.t-a-a-s.ru', data)
            console.log(`TAAS successfully received %s webhook`, bigFileWebhookUrl)
        }

        return successResponse;
    } catch (err) {
        console.log("Error: ", err);
        return getErrorResponse(err);
    }
}