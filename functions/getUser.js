const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // Store this in Netlify's environment variables

const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { hashedId } = JSON.parse(event.body);

        await client.connect();
        const database = client.db("users");
        const collection = database.collection("userData");

        const user = await collection.findOne({ _id: hashedId });

        if (user) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, user }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ success: false, message: "User not found" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    } finally {
        await client.close();
    }
};
