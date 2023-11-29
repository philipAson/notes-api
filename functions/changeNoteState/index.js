const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');

exports.handler = async (event, context) => {

    const {state} = event.pathParameters;
    const {id} = event.pathParameters;

    if (!id || !state) {
        return sendResponse(400, {message: "No id or state data"});
    }

    let setState;

    switch (state) {
        case "delete":
            setState = false;
            break;

        case "reactivate":
            setState = true;
            break;
        
        default:
            return sendResponse(400, {message: "wrong state input"});
    }

    try {

        await db.update({
            TableName: 'notes-db',
            Key: { id: id },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'set active = :active',
            ExpressionAttributeValues: {
                ":active": setState,
            }
        }).promise();
        
        return sendResponse(200, {success: true});
    } catch (error) {
        return sendResponse(500, {message: error});
    }
}