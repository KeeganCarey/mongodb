// Query1: How many tweets are not retweets or replies?
const { MongoClient } = require("mongodb");

async function main() {
  // connect to the db
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect(); // asyncio await
  const db = client.db("ieeevis2020");
  const tweets = db.collection("tweets");


  const count = await tweets.countDocuments({
    retweeted_status: { $exists: false },// doesnt have the retweeted_status field
    in_reply_to_status_id: null, // listed as null in the date
  });

  console.log("Tweets that are not retweets or replies:", count);

  // close the connection
  await client.close();
}


//run the main function and catch any errors to console
main().catch(console.error);
