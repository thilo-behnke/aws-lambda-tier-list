const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.TIER_TABLE;

exports.setTierIdHandler = async (event) => {
    const { body, httpMethod, path } = event;
    if (httpMethod !== 'PATCH') {
        throw new Error(`patchMethod only accepts PATCH method, you tried: ${httpMethod} method.`);
    }
    console.log('received:', JSON.stringify(event));

    // Get id and name from the body of the request
    const { id, tierId } = JSON.parse(body);

    const getExistingRecordParams = {
        TableName: tableName,
        Key: { id },
    };
    const { Item } = await docClient.get(getExistingRecordParams).promise();
    if (!Item) {
        throw new Error(`Cannot update tierId for no existing tier object with id ${id}`);
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const params = {
        TableName: tableName,
        Item: { ...Item, tierId },
    };
    await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body,
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
