const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require('../../responses');

exports.handler = async (event, context) => {

    
    let params = {
        TableName: 'notes-db',
        FilterExpression: 'uid = :uidValue AND active = :activeValue',
        ExpressionAttributeValues: {
            ':uidValue': "philipTest",
            ':activeValue': false
        }
    }

    try {
        const {Items} = await db.scan(params).promise();
        if (!Items) {
            return sendResponse(404, {message: "Ooopsie, nothin here!!!"})
        }

        let deletePromises = [];

        Items.forEach((item) => {
            deletePromises.push (
                db.delete({
                    TableName: 'notes-db',
                    Key: {
                      'id': item.id
                    }
                  }).promise()
            );
            
        });

        await Promise.all(deletePromises);

        return sendResponse(200, {message: Items});
    } catch (error) {
        return sendResponse(500, {message: error});
    }
}