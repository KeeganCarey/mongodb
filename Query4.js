// Query4: Top 10 people with more retweets in average, after tweeting more than 3 times

// this one was confusing  so i hope i got it right.

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
        $group: { // group by screen_name and calculate average retweets and count of tweets
          _id: "$user.screen_name",
          avg_retweets: { $avg: "$retweet_count" },
          tweet_count: { $sum: 1 },
        },
      },
      { $match: { tweet_count: { $gt: 3 } } }, // only include those with >3 tweets
      { $sort: { avg_retweets: -1 } }, // sort by average retweets descending
      { $limit: 10 }, // take top 10
      {
        $project: { // format the output  
          screen_name: "$_id",
          avg_retweets: { $round: ["$avg_retweets", 2] }, // round to 2 decimal places
          tweet_count: 1,
          _id: 0, // hide original _id field
        },
      },
    ])
    .toArray();

  console.log("Top 10 people by average retweets (tweeted more than 3 times):");
  console.table(results);

  // close the connection

  await client.close();
}


//run the main function and catch any errors to console
main().catch(console.error);
