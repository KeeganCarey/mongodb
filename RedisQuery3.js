// RedisQuery3: Compute how many distinct users are there in the dataset
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


  // clear the set in case we run this again
  await redisClient.del("screen_names");

  // go through all tweets and add each screen_name to the set
  // redis sets dont allow duplicates so it only keeps unique ones
  const cursor = tweets.find({});
  for await (const tweet of cursor) {
    await redisClient.sAdd("screen_names", tweet.user.screen_name); // SADD adds to the set
  }

  // SCARD gives us the number of elements in the set (distinct users)
  const count = await redisClient.sCard("screen_names");
  console.log(`There are ${count} distinct users`);

  // close the connections
  await redisClient.quit();
  await mongoClient.close();
}


//run main function
main();
