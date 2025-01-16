const { MongoClient } = require("mongodb");
const crypto = require("crypto");

const uri = process.env.MONGODB_URI; // MongoDB URI stored as an environment variable
const client = new MongoClient(uri);

// Function to hash the ID using SHA-256
const hashId = (id) => {
  return crypto.createHash('sha256').update(id).digest('hex');
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { id } = JSON.parse(event.body); // Parse the ID from the request body

    const hashedId = hashId(id); // Hash the ID before querying

    await client.connect();
    const database = client.db("yourDatabaseName"); // Replace with your actual database name
    const collection = database.collection("Secure"); // Use the "Secure" collection

    const user = await collection.findOne({ id: hashedId }); // Find user by hashed ID in the "Secure" collection

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
