// Query3: Who is the person that got the most tweets?
const { MongoClient } = require("mongodb");

async function main() {
  // connect to the db
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect(); // asyncio await
  const db = client.db("ieeevis2020");
  const tweets = db.collection("tweets");



  const results = await tweets
    .aggregate([
      {
        $match: { //  only include tweets that are replies to someone
          "in_reply_to_screen_name": { $ne: null },
        },
      },
      {
        $group: { // group by the person being tweeted at and count
          _id: "$in_reply_to_screen_name",
          tweet_count: { $sum: 1 },
        },
      },
      { $sort: { tweet_count: -1 } },
      { $limit: 1 },
      {
        $project: { //  format with screen_name and tweet_count
          screen_name: "$_id",
          tweet_count: 1,
          _id: 0,// hide original _id field
        },
      },
    ])
    .toArray();

  console.log("Person with the most tweets:");
  console.table(results);


  // close the connection
  await client.close();
}


//run the main function and catch any errors to console

main().catch(console.error);
