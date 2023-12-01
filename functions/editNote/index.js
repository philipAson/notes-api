const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const editNote = async (event, context)  => {

    if (event?.error && event?.error === '401')
        return sendResponse(401, {success: false, message: 'Invalid token'});

    const userID = event.id;
    const {id} = event.pathParameters
    const editDate = new Date().toISOString();
    const toEdit = JSON.parse(event.body);

    let params = {
        TableName: 'notes-db',
        Key: { id: id },
        ReturnValues: 'ALL_NEW',
        ConditionExpression: 'uid = :uidValue AND active = :activeValue',
        UpdateExpression: "set title = :titleValue, #text = :textValue, editDate = :editDate",
        ExpressionAttributeNames: {"#text" : "text"},
        ExpressionAttributeValues: {
            ':uidValue': userID,
            ':activeValue': true,
            ':editDate' : editDate,
            ':textValue' : toEdit.text,
            ':titleValue' : toEdit.title
        }
    }

    try {
        const { Attributes } = await db.update(params).promise();
        return sendResponse(200, {success: true, item: Attributes});
    } catch (error) {
        return sendResponse (500, {message: error});
    }

}

const handler = middy(editNote)
    .use(validateToken)

module.exports = { handler };