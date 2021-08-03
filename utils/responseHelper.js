const responseHeaders = {'Access-Control-Allow-Origin': '*'}
const successResponse = {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(
        {
            message: 'Ok',
        })
}

const getErrorResponse = (error) => {
    return {
        statusCode: error.statusCode ? error.statusCode : 500,
        headers: responseHeaders,
        body: JSON.stringify({
            error: error.name ? error.name : "Exception",
            message: error.message ? error.message : "Unknown error"
        })
    }
}

module.exports = {successResponse, getErrorResponse}