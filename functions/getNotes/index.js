const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');

exports.handler = async (event, context) => {

    
    let params = {
        TableName: 'notes-db',
        FilterExpression: 'uid = :uidValue',
        ExpressionAttributeValues: {
            ':uidValue': "philipTest"
        }
    }

    try {
        const {Items} = await db.scan(params).promise();
        if (!Items) {
            return sendResponse(404, {message: "Ooopsie!"})
        }
        return sendResponse(200, {message: Items});
    } catch (error) {
        return sendResponse(500, {message: error});
    }
}