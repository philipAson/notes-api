const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const postNotes = async (event, context) => {

    if(event?.error && event?.error === '401')
        return sendResponse(401, {success: false, message: 'Invalid token'});

    const note = JSON.parse(event.body);

    const timeStamp = new Date().getTime();
    const dateNow = new Date().toISOString;

    const userID = event.id;

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

const handler = middy(postNotes)
    .use(validateToken)
module.exports = {handler};