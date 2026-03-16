// Query5: Separate Users into a different collection and create a Tweets_Only collection
const { MongoClient } = require("mongodb");

async function main() {
  // connect to the db
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect(); // asyncio await
  const db = client.db("ieeevis2020");
  const tweets = db.collection("tweets");

  console.log("Creating Users collection...");
  await db.collection("Users").drop().catch(() => {});
  await tweets
    .aggregate([
      {
        $group: { // group by user id and get the first user document for each
          _id: "$user.id",
          user: { $first: "$user" },
        },
      },
      {
        $replaceRoot: { newRoot: "$user" }, // make the user document the root
      },
      { $out: "Users" }, // output to the Users collection
    ])
    .toArray();

    // count the number of unique users and log it
  const userCount = await db.collection("Users").countDocuments();
  console.log(`Users collection created with ${userCount} unique users.`);


  // create the Tweets_Only collection with a user_id field referencing the user
  console.log("Creating Tweets_Only collection...");
  await db.collection("Tweets_Only").drop().catch(() => {});
  await tweets
    .aggregate([
      {
        $addFields: { // add a user_id field referencing the user
          user_id: "$user.id",
        },
      },
      {
        $project: { // rremove the original user field
          user: 0,
        },
      },
      { $out: "Tweets_Only" }, // output to the Tweets_Only collection
    ])
    .toArray();

    // count the number of tweets in the Tweets_Only collection and log it
  const tweetCount = await db.collection("Tweets_Only").countDocuments();
  console.log(`Tweets_Only collection created with ${tweetCount} tweets.`);

  const sample = await db.collection("Tweets_Only").findOne();

  // show a sample document from the Tweets_Only collection to verify the structure
  console.log("\nSample Tweets_Only document (first few fields):");
  console.log({
    _id: sample._id,
    id: sample.id,
    text: sample.text?.substring(0, 80) + "...",
    user_id: sample.user_id,
  });


  //  close the connection
  await client.close();
}


//run the main function and catch any errors to console
main().catch(console.error);
