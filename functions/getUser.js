const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // MongoDB URI stored as an environment variable
const client = new MongoClient(uri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { id } = JSON.parse(event.body); // Parse the ID from the request body

    await client.connect();
    const database = client.db("yourDatabaseName"); // Replace with your actual database name
    const collection = database.collection("Secure"); // Use the "Secure" collection

    const user = await collection.findOne({ id: id }); // Use the raw ID from the request

    if (user) {
      return {
        statusCode: 200,
        body: JSON.stringify({ username: user.username, rank: user.rank }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  } finally {
    await client.close();
  }
};
