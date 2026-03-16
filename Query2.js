// Query2: Return the top 10 screen_names by their number of followers.
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
        $group: { // group by screen_name and get the max followers_count for each user
          _id: "$user.screen_name",
          followers_count: { $max: "$user.followers_count" },
        },
      },
      { $sort: { followers_count: -1 } }, // sort by followers_count descending
      { $limit: 10 }, // limit to top 10
      {
        $project: { // format the output
          screen_name: "$_id",
          followers_count: 1, // include followers_count in the output (fr some reasoon 1 is true 0 is false)
          _id: 0, // hide original _id field
        },
      },
    ])
    .toArray();

  console.log("Top 10 screen_names by followers:");
  console.table(results);

  // close the connection
  await client.close();
}


//run the main function and catch any errors to console
main().catch(console.error);
