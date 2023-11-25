function sendResponse(code, response){
    return {
        statusCode: code,
        headers: {
            "Content-Type": "aplication/json"
        },
        body: JSON.stringify(response),
    };
}

module.exports = {sendResponse}