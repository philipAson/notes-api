const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');

exports.handler = async (event, context) => {
    const note = JSON.parse(event.body);

    const timeStamp = new Date().getTime();
    const dateNow = new Date().getUTCDate();

    // psuedo UID
    const userID = "philipTest"

    note.id = `${timeStamp}`;
    note.date = `${dateNow}`;
    note.uid = `${userID}`;
    note.active = true;

    try {
        await db.put({
            TableName: 'notes-db',
            Item: note
        }).promise()

        return sendResponse(200, {success: true, message: note});
    } catch (error) {
        return sendResponse(500, {message: error});
    }
}