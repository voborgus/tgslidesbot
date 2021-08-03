const {bot} = require('../logic/bot');
const {successResponse, getErrorResponse} = require('../utils/responseHelper')

module.exports.eventHandler = async event => {
    try {
        console.log(event.body);
        await bot.handleUpdate(JSON.parse(event.body));
        return successResponse;
    } catch (err) {
        console.log("Error: ", err);
        return getErrorResponse(err);
    }
};