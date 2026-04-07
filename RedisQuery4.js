// RedisQuery4: Create a leaderboard with the top 10 users with more tweets
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

async function main() {
  // connect to the db
  const mongoClient = new MongoClient("mongodb://localhost:27017");
  await mongoClient.connect(); // asyncio await
  const db = mongoClient.db("ieeevis2020");
  const tweets = db.collection("tweets");

  // connect to redis
  const redisClient = createClient();
  await redisClient.connect();


  // clear the sorted set in case we run this again
  await redisClient.del("leaderboard");


  // go through all tweets and increment the score for each users screen_name
  const cursor = tweets.find({});
  for await (const tweet of cursor) {
    await redisClient.zIncrBy("leaderboard", 1, tweet.user.screen_name); // zIncrBy increments score by 1
  }

  // get the top 10 users with the highest scores (most tweets)
  const top10 = await redisClient.zRangeWithScores("leaderboard", 0, 9, { REV: true }); // REV for descending order

  console.log("Top 10 users with the most tweets:");
  top10.forEach((entry, i) => {
    console.log(`${i + 1}. ${entry.value}: ${entry.score} tweets`);
  });

  // close the connections
  await redisClient.quit();
  await mongoClient.close();
}



main();// run main func

