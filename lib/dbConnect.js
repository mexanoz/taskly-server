import { MongoClient, ServerApiVersion } from "mongodb";

const { MONGODB_URI, MONGODB_DATABASE, MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

const client = new MongoClient(MONGODB_URI, {
    auth: {
        username: MONGODB_USERNAME,
        password: MONGODB_PASSWORD
    },
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
} catch (err) {
    console.error(err);
}

export const db = client.db(MONGODB_DATABASE);