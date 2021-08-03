const {successResponse, getErrorResponse} = require('../utils/responseHelper')
const axios = require('axios')
const uploader = require('../client/googleDriveUploader');
const {bot} = require('../logic/bot');
const constants = require('../utils/constants')

module.exports.eventHandler = async event => {
    try {
        if (process.env.direct_download === "true") {
            console.log("Direct download is ON, I have nothing to do here.");
            return successResponse;
        }

        const body = JSON.parse(event.body);
        console.log("Got new big file request" + event.body);
        const userId = body.forward_info.origin.sender_user_id;
        let getFileUrl = "https://api.t-a-a-s.ru/client/files/" + body.content.document.document.remote.id +
            "?api_key=" + process.env.taas_api_key;
        console.log(getFileUrl)
        let file = await axios({url: getFileUrl, responseType: 'stream'});

        await uploader.upload(file.data,
            null,
            userId,
            body.content.document.file_name,
            body.content.document.mime_type,
            null,
            null);

        if (process.env.slides_chat_id) {
            await bot.telegram.sendMessage(process.env.slides_chat_id, constants.slidesChatSuccess)
        }

        return successResponse;
    } catch (err) {
        console.log("Error: ", err);
        return getErrorResponse(err);
    }
}